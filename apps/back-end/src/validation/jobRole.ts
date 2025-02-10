import Joi from "joi";
import { paginationSchema } from "./pagination";

export const createJobRoleSchema = Joi.object().keys({
    name: Joi.string().required(),
})

export const updateJobRoleSchema = Joi.object().keys({
    name: Joi.string().optional(),
    jobRoleId: Joi.string().required(),
})

export const deleteJobRoleSchema = Joi.object().keys({
    jobRoleId: Joi.string().required(),
})

export const getJobRoleSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})