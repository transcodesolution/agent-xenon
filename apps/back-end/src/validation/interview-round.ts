import Joi from "joi";
import { InterviewRoundStatus, InterviewRoundTypes } from "@agent-xenon/constants";

const roundTypeSchema = Joi.string().valid(...Object.values(InterviewRoundTypes))

export const createInterviewRoundSchema = Joi.object().keys({
    type: roundTypeSchema.required(),
    name: Joi.string().allow("").optional(),
    interviewerEmail: Joi.string().allow("").optional(),
    endDate: Joi.date().iso().optional(),
    qualificationCriteria: Joi.string().allow("").optional(),
    selectionMarginInPercentage: Joi.number().required(),
    questions: Joi.array().items(Joi.string()).required(),
    jobId: Joi.string().required(),
    roundNumber: Joi.number().required(),
})

export const updateInterviewRoundSchema = Joi.object().keys({
    type: roundTypeSchema.optional(),
    name: Joi.string().allow("").optional(),
    interviewerEmail: Joi.string().allow("").optional(),
    endDate: Joi.date().iso().optional(),
    qualificationCriteria: Joi.string().allow("").optional(),
    selectionMarginInPercentage: Joi.number().optional(),
    questions: Joi.array().items(Joi.string()).optional(),
    roundId: Joi.string().required(),
    roundNumber: Joi.number().optional(),
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
        answer: Joi.string().allow("").required(),
    })),
})

export const getExamQuestionSchema = Joi.object().keys({
    roundId: Joi.string().required(),
})

export const getApplicantRoundByIdSchema = Joi.object().keys({
    roundId: Joi.string().required(),
    applicantId: Joi.string().required(),
})

export const googleRedirectSchema = Joi.object().keys({
    organizationId: Joi.string().required(),
})