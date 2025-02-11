import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { createQuestionAnswerSchema, deleteQuestionAnswerSchema, getQuestionAnswerSchema, updateQuestionAnswerSchema } from "../../validation/question-answer";
import { INTERVIEW_QUESTION_TYPES } from "@agent-xenon/constants";
import InterviewQuestionAnswer from "../../database/models/interview-question-answer";
import RoundQuestionAssign from "../../database/models/round-question-assign";

export const createQuestionAnswer = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createQuestionAnswerSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkQuestionExist = await InterviewQuestionAnswer.findOne({ organizationId: user.organizationId, type: INTERVIEW_QUESTION_TYPES.MCQ, question: value.question, deletedAt: null });

        if (checkQuestionExist) return res.badRequest("question", {}, "dataAlreadyExist");

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

        const checkQuestionNameExist = await InterviewQuestionAnswer.findOne({ _id: { $ne: value.questionId }, organizationId: user.organizationId, type: INTERVIEW_QUESTION_TYPES.MCQ, question: value.question, deletedAt: null });

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
        const { error, value } = deleteQuestionAnswerSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkQuestionExist = await InterviewQuestionAnswer.findOne({ _id: value.questionId, deletedAt: null });

        if (!checkQuestionExist) return res.badRequest("question", {}, "getDataNotFound");

        const today = new Date();

        const checkApplicantIsGivingExam = await RoundQuestionAssign.findOne({ deletedAt: null, questionId: value.questionId }).populate({
            path: "roundId",
            match: {
                deletedAt: null,
                startDate: { $gte: new Date(today.setHours(0, 0, 0, 0)) },
                endDate: { $lt: new Date(today.setHours(23, 59, 59, 999)) },
            }
        });

        if (checkApplicantIsGivingExam?.roundId) return res.badRequest("round is in progress, cannot delete the question right now!", {}, "customMessage");

        const data = await InterviewQuestionAnswer.findByIdAndUpdate(value.questionId, { $set: { deletedAt: new Date() } }, { new: true });

        return res.ok("question", data, "deleteDataSuccess")
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