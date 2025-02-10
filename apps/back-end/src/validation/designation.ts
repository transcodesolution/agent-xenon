import Joi from "joi";
import { paginationSchema } from "./auth";

export const createDesignationSchema = Joi.object().keys({
    name: Joi.string().required(),
})

export const updateDesignationSchema = Joi.object().keys({
    name: Joi.string().optional(),
    designationId: Joi.string().required(),
})

export const deleteDesignationSchema = Joi.object().keys({
    designationId: Joi.string().required(),
})

export const getDesignationSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})