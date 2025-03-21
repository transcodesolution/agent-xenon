import { App } from "@agent-xenon/constants";
import Joi from "joi";

export const connectAppSchema = Joi.object({
    appId: Joi.string().required(),
});

export const onBoardAppSchema = Joi.object({
    name: Joi.string().valid(...Object.values(App)).required(),
});

export const getAppSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
})