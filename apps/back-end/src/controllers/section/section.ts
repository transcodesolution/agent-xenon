import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { ITopic } from "@agent-xenon/interfaces";
import Topic from "../../database/models/topic";
import { addSectionSchema, editSectionSchema, getSectionByIdSchema, getSectionSchema } from "../../validation/section";

export const createSection = async (req: Request, res: Response) => {
    try {
        const { error, value } = addSectionSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTopicExist = await Topic.findOne({ _id: value.topicId, deletedAt: null }).populate("childTopics");

        if (!checkTopicExist) return res.badRequest("topic", {}, "getDataNotFound");
        if (checkTopicExist.childTopics.length !== 0) return res.badRequest("could not add section to topic as this topic contains child topics", {}, "customMessage");

        const topic = await Topic.findByIdAndUpdate(value.topicId, { $push: { topicSections: value } }, { new: true });

        return res.ok("section added to topic", topic, "customMessage");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateSectionBySectionAndTopicId = async (req: Request, res: Response) => {
    try {
        Object.assign(req.body, req.params);
        const { error, value } = editSectionSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTopicExist = await Topic.findOne({ _id: value.topicId, deletedAt: null });

        if (!checkTopicExist) return res.badRequest("topic", {}, "getDataNotFound");

        const { topicId, sectionId, ...restUpdatedFields } = value;

        const sectionUpdatePayloadArray = Object.keys(restUpdatedFields).map((i) => ({ ["topicSections.$." + i]: value[i] }));

        const sectionUpdatePayload = Object.assign({}, ...sectionUpdatePayloadArray);

        const topic = await Topic.findOneAndUpdate({ _id: topicId, 'topicSections._id': sectionId }, { $set: sectionUpdatePayload }, { new: true });

        return res.ok("section updated to topic", topic, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteSectionBySectionAndTopicId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSectionByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTopicExist = await Topic.findOne({ _id: value.topicId, deletedAt: null });

        if (!checkTopicExist) return res.badRequest("topic", {}, "getDataNotFound");

        await Topic.updateOne({ _id: value.topicId }, { $pull: { topicSections: { _id: value.sectionId } } });

        return res.ok("section deleted in topic", {}, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getSectionsByTopicId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSectionSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const topic = await Topic.findOne({ _id: value.topicId, deletedAt: null });

        return res.ok("sections", { sections: topic?.topicSections }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getSectionBySectionIdAndTopicId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSectionByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<ITopic> = { deletedAt: null, _id: value.topicId };

        const topicData = await Topic.findOne<ITopic>(match, "topicSections");

        return res.ok("section", topicData?.topicSections?.find((i) => i._id.toString() === value.sectionId) ?? {}, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}