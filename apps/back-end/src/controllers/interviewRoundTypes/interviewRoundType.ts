import { Request, Response } from "express";
import Round_type from "../../database/models/roundType";
import { createInterviewRoundTypeSchema, deleteInterviewRoundTypeSchema, getInterviewRoundTypeSchema, updateInterviewRoundTypeSchema } from "../../validation/interviewRoundType";
import { FilterQuery } from "mongoose";
import { IRound_type } from "@agent-xenon/interfaces";

export const createInterviewRound = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createInterviewRoundTypeSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTypeExist = await Round_type.findOne({ organizationId: user.organizationId, name: value.name, deletedAt: null });

        if (checkTypeExist) return res.badRequest("interview round type", {}, "dataAlreadyExist");

        value.organizationId = user.organizationId;
        const data = await Round_type.create(value);

        return res.ok("interview round type", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateInterviewRound = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        req.body.roundTypeId = req.params.roundTypeId;
        const { error, value } = updateInterviewRoundTypeSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTypeExist = await Round_type.findOne({ _id: value.roundTypeId, deletedAt: null });

        if (!checkTypeExist) return res.badRequest("interview round type", {}, "getDataNotFound");

        const checkTypeNameExist = await Round_type.findOne({ _id: { $ne: value.roundTypeId }, organizationId: user.organizationId, name: value.name, deletedAt: null });

        if (checkTypeNameExist) return res.badRequest("interview round type", {}, "dataAlreadyExist");

        value.organizationId = user.organizationId;
        const data = await Round_type.findByIdAndUpdate(value.roundTypeId, { $set: value }, { new: true });

        return res.ok("interview round type", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteInterviewRound = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = deleteInterviewRoundTypeSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTypeExist = await Round_type.findOne({ _id: value.roundTypeId, deletedAt: null });

        if (!checkTypeExist) return res.badRequest("interview round type", {}, "getDataNotFound");

        value.organizationId = user.organizationId;
        const data = await Round_type.findByIdAndUpdate(value.roundTypeId, { $set: { deletedAt: new Date() } }, { new: true });

        return res.ok("interview round type", data, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getInterviewRounds = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        Object.assign(req.query, req.params);
        const { error, value } = getInterviewRoundTypeSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IRound_type> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            match.name = new RegExp(value.search, "i")
        }

        const [totalData, data] = await Promise.all([
            Round_type.countDocuments(match),
            Round_type.find(match).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("interview round type", { interviewRoundData: data, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}