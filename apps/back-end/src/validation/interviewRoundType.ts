import Joi from "joi";
import { paginationSchema } from "./pagination";

export const createInterviewRoundTypeSchema = Joi.object().keys({
    name: Joi.string().required(),
});

export const updateInterviewRoundTypeSchema = Joi.object().keys({
    name: Joi.string().required(),
    roundTypeId: Joi.string().required(),
});

export const deleteInterviewRoundTypeSchema = Joi.object().keys({
    roundTypeId: Joi.string().required(),
})

export const getInterviewRoundTypeSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    ...paginationSchema,
})