import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { ITopic } from "@agent-xenon/interfaces";
import Training from "../../database/models/training";
import { addTopicSchema, deleteTopicSchema, editTopicSchema, getTopicByIdSchema, getTopicSchema } from "../../validation/topic";
import Topic from "../../database/models/topic";

function buildTree(flatList: ITopic[]) {
    const idMap = new Map();

    for (const node of flatList) {
        node.childTopics = [];
        idMap.set(String(node._id), node);
    }

    const tree = [];

    for (const node of flatList) {
        if (node.parentTopicId) {
            const parent = idMap.get(String(node.parentTopicId));
            if (parent) parent.childTopics.push(node);
        } else {
            tree.push(node);
        }
    }

    return tree;
}

export const createTopic = async (req: Request, res: Response) => {
    try {
        const { error, value } = addTopicSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTrainingExist = await Training.findOne({ _id: value.trainingId, deletedAt: null });

        if (!checkTrainingExist) return res.badRequest("employee training", {}, "getDataNotFound");

        if (value.parentTopicId) {
            const checkTopicExist = await Topic.findOne({ _id: value.parentTopicId, deletedAt: null });

            if (!checkTopicExist) return res.badRequest("parent topic", {}, "getDataNotFound");
        }

        const topic = await Topic.create(value);

        if (!topic.parentTopicId) {
            await Training.findOneAndUpdate({ _id: value.trainingId }, { $push: { topicIds: topic._id } });
        }

        return res.ok("topic", topic, "addDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateTopic = async (req: Request, res: Response) => {
    try {
        req.body.id = req.params.id;
        const { error, value } = editTopicSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTopicExist = await Topic.findOne({ _id: value.id, deletedAt: null });

        if (!checkTopicExist) return res.badRequest("topic", {}, "getDataNotFound");

        const topic = await Topic.findByIdAndUpdate(value.id, { $set: value }, { new: true });

        return res.ok("topic", topic, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteTopicById = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteTopicSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTopicExist = await Topic.findOne({ _id: value.id, deletedAt: null });

        if (!checkTopicExist) return res.badRequest("topic", {}, "getDataNotFound");

        await Topic.bulkWrite([
            {
                updateOne: {
                    filter: { _id: value.id, deletedAt: null },
                    update: { $set: { deletedAt: new Date() } }
                }
            },
            {
                updateMany: {
                    filter: { parentTopicId: value.id, deletedAt: null },
                    update: { $set: { deletedAt: new Date() } }
                }
            }
        ]);

        return res.ok("topic", {}, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getTopicsByTrainingId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getTopicSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        // ---- IF WE WILL CONVERT CODE TO PROCESS TOPICS BY MONGODB USING GRAPH LOOKUP OPERATOR ------- Uncomment it
        // const topics = await Topic.aggregate([
        //     {
        //         $match: {
        //             trainingId: new mongoose.Types.ObjectId(value.trainingId),
        //             parentTopicId: null,
        //             deletedAt: null,
        //         },
        //     },
        //     {
        //         $graphLookup: {
        //             from: 'topics',
        //             startWith: '$_id',
        //             connectFromField: '_id',
        //             connectToField: 'parentTopicId',
        //             as: 'childTopics',
        //             restrictSearchWithMatch: { deletedAt: null },
        //             depthField: 'level',
        //         },
        //     },
        //     {
        //         $project: {
        //             flat: {
        //                 $concatArrays: [
        //                     [ // wrap root as a single-element array
        //                         {
        //                             _id: '$_id',
        //                             name: '$name',
        //                             description: '$description',
        //                             trainingId: '$trainingId',
        //                             parentTopicId: '$parentTopicId',
        //                             deletedAt: '$deletedAt',
        //                             sections: '$sections',
        //                             createdAt: '$createdAt',
        //                             updatedAt: '$updatedAt',
        //                             level: -1,
        //                         }
        //                     ],
        //                     '$childTopics' // add all descendants
        //                 ]
        //             }
        //         }
        //     },
        //     {
        //         $unwind: '$flat'
        //     },
        //     {
        //         $replaceRoot: { newRoot: '$flat' }
        //     },
        // ]);

        const topics = await Topic.find({ trainingId: value.trainingId, deletedAt: null });

        return res.ok("topics", { topics: buildTree(topics) }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getTopicById = async (req: Request, res: Response) => {
    try {
        const { error, value } = getTopicByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<ITopic> = { deletedAt: null, _id: value.id };

        const topicData = await Topic.findOne<ITopic>(match, "name description childTopics sections").populate("childTopics");

        return res.ok("topic", topicData ?? {}, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}