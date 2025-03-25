import Joi from "joi";

export const codeExecuteSchema = Joi.object({
    code: Joi.string().required(),
    language: Joi.string().required(),
    version: Joi.string().required(),
})