import Joi from "joi";
import { paginationSchema } from "./pagination";

const userSchema = {
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    roleId: Joi.string(),
    id: Joi.string()
};

export const createUserSchema = Joi.object({ ...userSchema, email: userSchema.email.required() });

export const updateUserSchema = Joi.object(userSchema);

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