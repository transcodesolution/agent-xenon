import Joi from "joi";
import { ANSWER_INPUT_FORMAT, ANSWER_MCQ_OPTION, DIFFICULTY } from "@agent-xenon/constants";
import { paginationSchema } from "./pagination";

const questionAnswerSchema = {
    description: Joi.string().optional(),
    promptText: Joi.string().optional(),
    answerDetails: Joi.object().keys({ codeText: Joi.string().optional(), text: Joi.string().optional() }).optional(),
    options: Joi.array().items({ text: Joi.string().required(), index: Joi.string().valid(ANSWER_MCQ_OPTION.A, ANSWER_MCQ_OPTION.B, ANSWER_MCQ_OPTION.C, ANSWER_MCQ_OPTION.D).required() }).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    difficulty: Joi.string().valid(DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD).optional(),
    timeLimitInMinutes: Joi.number().optional(),
    evaluationCriteria: Joi.string().optional(),
    inputFormat: Joi.string().valid(ANSWER_INPUT_FORMAT.MCQ, ANSWER_INPUT_FORMAT.CODE, ANSWER_INPUT_FORMAT.FILE, ANSWER_INPUT_FORMAT.TEXT).optional(),
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