import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { IDesignation } from "@agent-xenon/interfaces";
import Designation from "../../database/models/designation";
import { createDesignationSchema, deleteDesignationSchema, getDesignationSchema, updateDesignationSchema } from "../../validation/designation";

export const createJobDesignation = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createDesignationSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        const data = await Designation.create(value);

        return res.ok("designation", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateJobDesignation = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        req.body.designationId = req.params.designationId;
        const { error, value } = updateDesignationSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkDesignationExist = await Designation.findOne({ _id: value.designationId, deletedAt: null });

        if (!checkDesignationExist) return res.badRequest("designation", {}, "getDataNotFound");

        const checkRoleNameExist = await Designation.findOne({ _id: { $ne: value.designationId }, organizationId: user.organizationId, name: value.name, deletedAt: null });

        if (checkRoleNameExist) return res.badRequest("designation", {}, "dataAlreadyExist");

        value.organizationId = user.organizationId;
        const data = await Designation.findByIdAndUpdate(value.designationId, { $set: value }, { new: true });

        return res.ok("designation", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteJobDesignation = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = deleteDesignationSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkDesignationExist = await Designation.findOne({ _id: value.designationId, deletedAt: null });

        if (!checkDesignationExist) return res.badRequest("designation", {}, "getDataNotFound");

        value.organizationId = user.organizationId;
        const data = await Designation.findByIdAndUpdate(value.designationId, { $set: { deletedAt: new Date() } }, { new: true });

        return res.ok("designation", data, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getJobDesignation = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        Object.assign(req.query, req.params);
        const { error, value } = getDesignationSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IDesignation> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            match.name = new RegExp(value.search, "i")
        }

        const [totalData, designations] = await Promise.all([
            Designation.countDocuments(match),
            Designation.find(match).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("designation", { designations, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}