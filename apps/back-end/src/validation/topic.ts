import Joi from "joi";

const topicSchema = {
    name: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
    parentTopicId: Joi.string().allow("").optional(),
};

const topicIdSchema = {
    id: Joi.string().required(),
}

export const addTopicSchema = Joi.object({ ...topicSchema, trainingId: Joi.string().required(), });

export const editTopicSchema = Joi.object({
    ...topicSchema,
    ...topicIdSchema,
})

export const deleteTopicSchema = Joi.object(topicIdSchema);

export const getTopicSchema = Joi.object({
    trainingId: Joi.string().required(),
});

export const getTopicByIdSchema = Joi.object(topicIdSchema);
