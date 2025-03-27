import Joi from "joi";
import { paginationSchema } from "./pagination";

export const createUpdateUserSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    roleId: Joi.string(),
    id: Joi.string()
});

export const deleteUserSchema = Joi.object({
    ids: Joi.array().items(Joi.string().required())
});

export const userByIdSchema = Joi.object({
    id: Joi.string().required()
});

export const getUserSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})