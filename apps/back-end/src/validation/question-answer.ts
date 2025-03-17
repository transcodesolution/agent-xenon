import Joi from "joi";
import { paginationSchema } from "./pagination";
import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty } from "@agent-xenon/constants";

const questionAnswerSchema = {
    description: Joi.string().optional(),
    options: Joi.array().items({ text: Joi.string().required(), isRightAnswer: Joi.boolean().required(), index: Joi.string().valid(AnswerMcqOptionFormat.A, AnswerMcqOptionFormat.B, AnswerMcqOptionFormat.C, AnswerMcqOptionFormat.D).required() }).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    difficulty: Joi.string().valid(Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD).optional(),
    timeLimitInMinutes: Joi.number().optional(),
    evaluationCriteria: Joi.string().optional(),
    questionFormat: Joi.string().valid(AnswerQuestionFormat.MCQ, AnswerQuestionFormat.CODE, AnswerQuestionFormat.FILE, AnswerQuestionFormat.TEXT).optional(),
}

export const createQuestionAnswerSchema = Joi.object().keys({
    question: Joi.string(),
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
    questionFormat: Joi.string().valid(...Object.values(AnswerQuestionFormat)).optional(),
    search: Joi.string().allow("").optional(),
})

export const getQuestionByIdSchema = Joi.object().keys({
    questionId: Joi.string().required(),
})