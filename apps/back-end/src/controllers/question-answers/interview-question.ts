import { Request, Response } from "express";
import { FilterQuery, RootFilterQuery } from "mongoose";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { createQuestionAnswerSchema, deleteQuestionAnswerSchema, getAllQuestionSchema, getQuestionAnswerSchema, getQuestionByIdSchema, updateQuestionAnswerSchema } from "../../validation/question-answer";
import InterviewQuestionAnswer from "../../database/models/interview-question-answer";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { AnswerQuestionFormat, InterviewRoundTypes } from "@agent-xenon/constants";

export const createQuestionAnswer = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createQuestionAnswerSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        const data = await InterviewQuestionAnswer.create(value);

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

        const checkQuestionExist = await InterviewQuestionAnswer.findOne({ _id: value.questionId, deletedAt: null });

        if (!checkQuestionExist) return res.badRequest("question", {}, "getDataNotFound");

        const checkQuestionNameExist = await InterviewQuestionAnswer.findOne({ _id: { $ne: value.questionId }, organizationId: user.organizationId, type: InterviewRoundTypes.ASSESSMENT, questionFormat: AnswerQuestionFormat.MCQ, question: value.question, deletedAt: null });

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

        const data = await InterviewQuestionAnswer.findByIdAndUpdate(value.questionId, { $set: value }, { new: true });

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

        const Query: RootFilterQuery<IInterviewQuestionAnswer> = { _id: { $in: value.questionIds }, deletedAt: null };

        const checkQuestionExist = await InterviewQuestionAnswer.find(Query);

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

        await InterviewQuestionAnswer.updateMany(Query, { $set: { deletedAt: new Date() } }, { new: true });

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

        const match: FilterQuery<IInterviewQuestionAnswer> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            const searchRegex = new RegExp(value.search, "i")
            match.$or = [
                { question: searchRegex },
                { type: searchRegex },
                { difficulty: searchRegex },
            ]
        }

        const [totalData, data] = await Promise.all([
            InterviewQuestionAnswer.countDocuments(match),
            InterviewQuestionAnswer.find(match).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("question", { questionData: data, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
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

        const match: FilterQuery<IInterviewQuestionAnswer> = { deletedAt: null, organizationId: user.organizationId, questionFormat: value.questionFormat ?? AnswerQuestionFormat.MCQ };

        if (value.search) {
            match.question = new RegExp(value.search, "i");
        }

        const questionAnswerData = await InterviewQuestionAnswer.find(match, "question").sort({ _id: -1 });

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

        const match: FilterQuery<IInterviewQuestionAnswer> = { deletedAt: null, _id: value.questionId }

        const questions = await InterviewQuestionAnswer.findOne(match);

        return res.ok("interview question", questions, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}