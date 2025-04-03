import Joi from "joi";
import { paginationSchema } from "./pagination";

export const createDesignationSchema = Joi.object().keys({
    name: Joi.string().allow("").optional(),
    description: Joi.string().optional(),
})

export const updateDesignationSchema = Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    designationId: Joi.string().required(),
})

export const deleteDesignationSchema = Joi.object().keys({
    designationId: Joi.array().items(Joi.string().required()),
})

export const getDesignationSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})

export const getJobDesignationByIdSchema = Joi.object().keys({
    designationId: Joi.string().required(),
})