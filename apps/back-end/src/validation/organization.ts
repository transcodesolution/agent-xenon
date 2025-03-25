import Joi from "joi";
import { paginationSchema } from "./pagination";

export const createOrganizationSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    description: Joi.string().allow(""),
    address: Joi.string().allow(""),
})

export const updateOrganizationSchema = Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    description: Joi.string().allow("").optional(),
    address: Joi.string().allow("").optional(),
})

export const deleteOrganizationSchema = Joi.object().keys({
    organizationId: Joi.string().required(),
})

export const getOrganizationSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})