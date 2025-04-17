import { TopicSectionType } from "@agent-xenon/constants";
import Joi from "joi";

const sectionIdSchema = {
    sectionId: Joi.string().required(),
}

const sectionSchema = {
    "topicSectionConfig.assistent.prompt": Joi.string().allow("").optional(),
    "topicSectionConfig.audio.audioDescription": Joi.string().allow("").optional(),
    "topicSectionConfig.audio.audioTitle": Joi.string().allow("").optional(),
    "topicSectionConfig.audio.audioURL": Joi.string().allow("").optional(),
    "topicSectionConfig.video.videoDescription": Joi.string().allow("").optional(),
    "topicSectionConfig.video.videoTitle": Joi.string().allow("").optional(),
    "topicSectionConfig.video.videoURL": Joi.string().allow("").optional(),
    "topicSectionConfig.text.text": Joi.string().allow("").optional(),
    "topicSectionConfig.practical.questions": Joi.array().items(Joi.object().keys({ questionId: Joi.string().optional() })).optional(),
    name: Joi.string().allow("").optional(),
    content: Joi.string().allow("").optional(),
    type: Joi.string().valid(...Object.values(TopicSectionType)).optional(),
    topicId: sectionIdSchema.sectionId,
};

export const addSectionSchema = Joi.object().keys({ ...sectionSchema, order: Joi.number().required() });

export const editSectionSchema = Joi.object({
    ...sectionSchema,
    ...sectionIdSchema,
})

export const editSectionOrderSchema = Joi.object({
    sectionIds: Joi.array().items(Joi.string().optional()).optional(),
})

export const getSectionSchema = Joi.object({
    topicId: Joi.string().required(),
});

export const getSectionByIdSchema = Joi.object().keys({ sectionId: sectionIdSchema.sectionId, topicId: sectionIdSchema.sectionId });
