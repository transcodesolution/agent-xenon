import Joi from "joi";
import { paginationSchema } from "./pagination";
import { TrainingLevel } from "@agent-xenon/constants";

export const addEditEmployeeTrainingSchema = Joi.object({
    name: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    tags: Joi.array().items(Joi.string().allow("").optional()).optional(),
    level: Joi.string().valid(...Object.values(TrainingLevel)).optional(),
    trainingId: Joi.string().allow("").optional(),
});

export const addEnrollmentInTrainingSchema = Joi.object({
    employeeIds: Joi.array().items(Joi.string().optional()).required(),
    trainingId: Joi.string().required(),
})

export const deleteEnrollmentInTrainingSchema = Joi.object({
    employeeIds: Joi.array().items(Joi.string().optional()).required(),
    trainingId: Joi.string().required(),
})

export const deleteEmployeeTrainingSchema = Joi.object({
    trainingIds: Joi.array().items(Joi.string()).required(),
});

export const getEmployeeTrainingSchema = Joi.object({
    search: Joi.string().allow("", null).optional(),
    ...paginationSchema,
});

export const getEmployeeTrainingByIdSchema = Joi.object({
    trainingId: Joi.string().optional(),
});
