import Joi from "joi";
import { InterviewRoundTypes, TechnicalRoundTypes } from "@agent-xenon/constants";
import { paginationSchema } from "./pagination";

const roundTypeSchema = Joi.string().valid(...Object.values(InterviewRoundTypes))
const roundSubTypeSchema = Joi.string().valid(...Object.values(TechnicalRoundTypes))

export const createInterviewRoundSchema = Joi.object().keys({
    type: roundTypeSchema.required(),
    subType: roundSubTypeSchema.optional(),
    durationInSeconds: Joi.number().optional(),
    qualificationCriteria: Joi.string().optional(),
    mcqCriteria: Joi.number().optional(),
    questions: Joi.array().items(Joi.string()).required(),
    jobId: Joi.string().required(),
})

export const updateInterviewRoundSchema = Joi.object().keys({
    type: roundTypeSchema.optional(),
    subType: roundSubTypeSchema.optional(),
    durationInSeconds: Joi.number().optional(),
    qualificationCriteria: Joi.string().optional(),
    mcqCriteria: Joi.number().optional(),
    newQuestionIds: Joi.array().items(Joi.string()).optional(),
    removeQuestionIds: Joi.array().items(Joi.string()).optional(),
    roundId: Joi.string().required(),
})

export const deleteInterviewRoundSchema = Joi.object().keys({
    roundIds: Joi.string().required(),
})

export const getInterviewRoundQuestionSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    roundId: Joi.string().required(),
    jobId: Joi.string().required(),
    ...paginationSchema,
})

export const manageInterviewRoundSchema = Joi.object().keys({
    roundId: Joi.string().required(),
    jobId: Joi.string().required(),
})

export const submitExamSchema = Joi.object().keys({
    roundId: Joi.string().required(),
    questionAnswers: Joi.array().items(Joi.object().keys({
        questionId: Joi.string().required(),
        answerDetails: Joi.object().keys({ codeText: Joi.string().allow("").optional(), text: Joi.string().allow("").optional() }).optional()
    })),
})

export const getExamQuestionSchema = Joi.object().keys({
    candidateToken: Joi.string().required(),
})