import Joi from "joi";
import { paginationSchema } from "./pagination";

const employeeIdSchema = { employeeId: Joi.string().optional(), }

export const updateEmployeeSchema = Joi.object().keys({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    password: Joi.string().optional(),
    salary: Joi.number().optional(),
    jobRoleId: Joi.string().optional(),
    designationId: Joi.string().optional(),
    contactInfo: Joi.object().keys({
        address: Joi.string().allow("").optional(),
        city: Joi.string().allow("").optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().allow("").optional(),
        state: Joi.string().allow("").optional(),
    }).optional(),
    ...employeeIdSchema,
})

export const deleteEmployeeSchema = Joi.object().keys({
    employeeIds: Joi.array().items(employeeIdSchema.employeeId).required(),
})

export const getEmployeeSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    jobRoleId: Joi.string().optional(),
    designationId: Joi.string().optional(),
    ...paginationSchema,
})

export const getEmployeeByIdSchema = Joi.object().keys(employeeIdSchema)