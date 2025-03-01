import Joi from "joi";
import { InterviewRoundStatus, InterviewRoundTypes, TechnicalRoundTypes } from "@agent-xenon/constants";

const roundTypeSchema = Joi.string().valid(...Object.values(InterviewRoundTypes))
const roundSubTypeSchema = Joi.string().valid(...Object.values(TechnicalRoundTypes))

export const createInterviewRoundSchema = Joi.object().keys({
    type: roundTypeSchema.required(),
    subType: roundSubTypeSchema.optional(),
    name: Joi.string().allow("").optional(),
    durationInSeconds: Joi.number().optional(),
    qualificationCriteria: Joi.string().allow("").optional(),
    mcqCriteria: Joi.number().optional(),
    questions: Joi.array().items(Joi.string()).required(),
    jobId: Joi.string().required(),
})

export const updateInterviewRoundSchema = Joi.object().keys({
    type: roundTypeSchema.optional(),
    subType: roundSubTypeSchema.optional(),
    name: Joi.string().allow("").optional(),
    durationInSeconds: Joi.number().optional(),
    qualificationCriteria: Joi.string().allow("").optional(),
    mcqCriteria: Joi.number().optional(),
    questions: Joi.array().items(Joi.string()).optional(),
    roundId: Joi.string().required(),
})

export const deleteInterviewRoundSchema = Joi.object().keys({
    roundIds: Joi.array().items(Joi.string().required()),
})

export const updateRoundStatusSchema = Joi.object().keys({
    roundStatus: Joi.string().valid(...Object.values(InterviewRoundStatus)).optional(),
    jobId: Joi.string().required(),
    roundId: Joi.string().required(),
    applicantId: Joi.string(),
})

export const getInterviewRoundsByIdSchema = Joi.object().keys({
    roundId: Joi.string().required(),
})

export const getInterviewRoundByJobIdSchema = Joi.object().keys({
    jobId: Joi.string().required(),
})

export const updateRoundOrderSchema = Joi.object().keys({
    roundOrderIds: Joi.array().items(Joi.string().required()).required(),
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

export const googleRedirectSchema = Joi.object().keys({
    organizationId: Joi.string().required(),
    jobId: Joi.string().required(),
    roundId: Joi.string().required(),
})