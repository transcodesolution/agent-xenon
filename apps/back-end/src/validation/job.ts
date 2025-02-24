import Joi from "joi";
import { paginationSchema } from "./pagination";
import { InterviewRoundTypes, JobStatus, TechnicalRoundTypes } from "@agent-xenon/constants";

const jobSchema = {
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    role: Joi.string().optional(),
    designation: Joi.string().optional(),
}

const jobIdSchema = { jobId: Joi.string().required(), }

export const createJobSchema = Joi.object().keys({
    ...jobSchema,
    rounds: Joi.array().items(Joi.object().keys({
        type: Joi.string().valid(...Object.values(InterviewRoundTypes)),
        subType: Joi.string().valid(...Object.values(TechnicalRoundTypes)).optional(),
        durationInSeconds: Joi.number(),
        qualificationCriteria: Joi.string(),
        mcqCriteria: Joi.number(),
        roundNumber: Joi.number(),
        questions: Joi.array().items(Joi.string()),
    })).optional(),
})

export const updateJobSchema = Joi.object().keys({
    ...jobSchema,
    ...jobIdSchema,
    status: Joi.string().valid(JobStatus.CLOSE, JobStatus.PAUSED, JobStatus.INTERVIEW_STARTED).optional(),
})

export const deleteJobSchema = Joi.object().keys({
    jobIds: Joi.array().items(jobIdSchema.jobId)
})

export const addResumeLinkSchema = Joi.object().keys({
    ...jobIdSchema,
    resumeUrls: Joi.array().items(jobIdSchema.jobId),
})

export const deleteResumeLinkSchema = Joi.object().keys({
    resumeUrl: jobIdSchema.jobId,
    ...jobIdSchema,
})

export const getResumeLinkSchema = Joi.object().keys(jobIdSchema)

export const getJobSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    role: Joi.string().optional(),
    designation: Joi.string().optional(),
    ...paginationSchema,
})

export const getJobByIdSchema = Joi.object().keys({
    jobId: Joi.string().required(),
    ...paginationSchema,
})