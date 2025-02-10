import Joi from "joi";

export const paginationSchema = {
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
};