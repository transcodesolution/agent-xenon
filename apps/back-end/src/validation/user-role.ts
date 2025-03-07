import Joi from "joi";
import { paginationSchema } from "./pagination";
import { Permission, RoleType } from "@agent-xenon/constants";

export const createUserRoleSchema = Joi.object().keys({
    name: Joi.string().optional(),
    permissions: Joi.array().items(Joi.string().valid(...Object.values(Permission))).required(),
})

export const updateUserRoleSchema = Joi.object().keys({
    name: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(RoleType)).optional(),
    permissions: Joi.array().items(Joi.string().valid(...Object.values(Permission))).optional(),
    roleId: Joi.string().required(),
})

export const deleteUserRoleSchema = Joi.object().keys({
    roleId: Joi.string().required(),
})

export const getUserRoleSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})