import Joi from "joi";
import { paginationSchema } from "./pagination";
import { AnswerInputFormat, AnswerMcqOptionFormat, Difficulty, TechnicalRoundTypes } from "@agent-xenon/constants";

const questionAnswerSchema = {
    description: Joi.string().optional(),
    promptText: Joi.string().optional(),
    answerDetails: Joi.object().keys({ codeText: Joi.string().optional(), text: Joi.string().optional() }).optional(),
    options: Joi.array().items({ text: Joi.string().required(), index: Joi.string().valid(AnswerMcqOptionFormat.A, AnswerMcqOptionFormat.B, AnswerMcqOptionFormat.C, AnswerMcqOptionFormat.D).required() }).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    difficulty: Joi.string().valid(Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD).optional(),
    timeLimitInMinutes: Joi.number().optional(),
    evaluationCriteria: Joi.string().optional(),
    inputFormat: Joi.string().valid(AnswerInputFormat.MCQ, AnswerInputFormat.CODE, AnswerInputFormat.FILE, AnswerInputFormat.TEXT).optional(),
}

export const createQuestionAnswerSchema = Joi.object().keys({
    question: Joi.string().required(),
    ...questionAnswerSchema,
})

export const updateQuestionAnswerSchema = Joi.object().keys({
    question: Joi.string().optional(),
    ...questionAnswerSchema,
    questionId: Joi.string().required(),
})

export const deleteQuestionAnswerSchema = Joi.object().keys({
    questionId: Joi.string().required(),
})

export const getQuestionAnswerSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})

export const getAllQuestionSchema = Joi.object().keys({
    subType: Joi.string().valid(...Object.values(TechnicalRoundTypes)).optional(),
    search: Joi.string().allow("").optional(),
})