import { Request, Response } from "express";
import { FilterQuery, RootFilterQuery } from "mongoose";
import { IInterviewQuestion } from "@agent-xenon/interfaces";
import { createQuestionAnswerSchema, deleteQuestionAnswerSchema, getAllQuestionSchema, getQuestionAnswerSchema, getQuestionByIdSchema, updateQuestionAnswerSchema } from "../../validation/question-answer";
import InterviewQuestion from "../../database/models/interview-question";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { AnswerQuestionFormat } from "@agent-xenon/constants";

export const createQuestionAnswer = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createQuestionAnswerSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        const data = await InterviewQuestion.create(value);

        return res.ok("question", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateQuestionAnswer = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        req.body.questionId = req.params.questionId;
        const { error, value } = updateQuestionAnswerSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkQuestionExist = await InterviewQuestion.findOne({ _id: value.questionId, deletedAt: null });

        if (!checkQuestionExist) return res.badRequest("question", {}, "getDataNotFound");

        const checkQuestionNameExist = await InterviewQuestion.findOne({ _id: { $ne: value.questionId }, organizationId: user.organizationId, questionFormat: AnswerQuestionFormat.MCQ, question: value.question, deletedAt: null });

        if (checkQuestionNameExist) return res.badRequest("question", {}, "dataAlreadyExist");

        const today = new Date();

        const checkApplicantIsGivingExam = await RoundQuestionAssign.findOne({ deletedAt: null, questionId: value.questionId }).populate({
            path: "roundId",
            match: {
                deletedAt: null,
                startDate: { $gte: new Date(today.setHours(0, 0, 0, 0)) },
                endDate: { $lt: new Date(today.setHours(23, 59, 59, 999)) },
            }
        });

        if (checkApplicantIsGivingExam?.roundId) return res.badRequest("round is in progress, cannot edit the question right now!", {}, "customMessage");

        const data = await InterviewQuestion.findByIdAndUpdate(value.questionId, { $set: value }, { new: true });

        return res.ok("question", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteQuestionAnswer = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteQuestionAnswerSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: RootFilterQuery<IInterviewQuestion> = { _id: { $in: value.questionIds }, deletedAt: null };

        const checkQuestionExist = await InterviewQuestion.find(Query);

        if (checkQuestionExist.length !== value.questionIds.length) return res.badRequest("some questions", {}, "getDataNotFound");

        const today = new Date();

        const checkApplicantIsGivingExam = await RoundQuestionAssign.find({ deletedAt: null, questionId: { $in: value.questionIds } }).populate({
            path: "roundId",
            match: {
                deletedAt: null,
                startDate: { $lte: today },
                endDate: { $gt: today },
            }
        });

        if (checkApplicantIsGivingExam.some((i) => (i?.roundId))) return res.badRequest("round is in progress, cannot delete the selected question right now!", {}, "customMessage");

        await InterviewQuestion.updateMany(Query, { $set: { deletedAt: new Date() } }, { new: true });

        return res.ok("questions", {}, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getQuestions = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getQuestionAnswerSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IInterviewQuestion> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            const searchRegex = new RegExp(value.search, "i")
            match.$or = [
                { question: searchRegex },
                { difficulty: searchRegex },
            ]
        }

        const [totalData, data] = await Promise.all([
            InterviewQuestion.countDocuments(match),
            InterviewQuestion.find(match).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("question", { questions: data, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getAllQuestionList = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getAllQuestionSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const regexToFilterPriorityQuestionFirst = /^(text|mcq|file|code|coding)\b(\s*:)?/i;

        const match: FilterQuery<IInterviewQuestion> = { deletedAt: null, organizationId: user.organizationId };

        if (value.search) {
            const searchedString = value.search.match(regexToFilterPriorityQuestionFirst)?.[1];
            const isRelatedTextFound = !!searchedString;
            value.search = value.search.replace(regexToFilterPriorityQuestionFirst, "").trim();
            if (isRelatedTextFound) {
                match.questionFormat = searchedString.toLowerCase();
            }
            match.question = new RegExp(value.search, "i");
        }

        const questionAnswerData = await InterviewQuestion.find(match, "question").sort({ _id: -1 });

        return res.ok("questions", questionAnswerData, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getQuestionById = async (req: Request, res: Response) => {
    try {
        const { error, value } = getQuestionByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IInterviewQuestion> = { deletedAt: null, _id: value.questionId }

        const questions = await InterviewQuestion.findOne(match);

        return res.ok("interview question", questions, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}