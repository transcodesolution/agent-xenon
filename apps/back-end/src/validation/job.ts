import Joi from "joi";
import { paginationSchema } from "./pagination";
import { JOB_STATUS } from "@agent-xenon/constants";

const jobSchema = {
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    role: Joi.string().optional(),
    designation: Joi.string().optional(),
    screeningCriteria: Joi.string().optional(),
}

const jobIdSchema = { jobId: Joi.string().required(), }

export const createJobSchema = Joi.object().keys({
    ...jobSchema,
    rounds: Joi.array().items(Joi.object().keys({
        type: Joi.string(),
        durationInSeconds: Joi.number(),
        qualificationCriteria: Joi.string(),
        roundNumber: Joi.number(),
        questions: Joi.array().items(Joi.string()),
    })).optional(),
})

export const updateJobSchema = Joi.object().keys({
    ...jobSchema,
    ...jobIdSchema,
    status: Joi.string().valid(JOB_STATUS.CLOSE, JOB_STATUS.PAUSED, JOB_STATUS.INTERVIEW_STARTED).optional(),
})

export const deleteJobSchema = Joi.object().keys({
    ...jobIdSchema
})

export const getJobSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    role: Joi.string().optional(),
    designation: Joi.string().optional(),
    ...paginationSchema,
})