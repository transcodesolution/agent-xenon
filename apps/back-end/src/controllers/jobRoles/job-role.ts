import { Request, Response } from "express";
import { createJobRoleSchema, deleteJobRoleSchema, getJobRoleSchema, updateJobRoleSchema } from "../../validation/job-role";
import JobRole from "../../database/models/job-role";
import { FilterQuery } from "mongoose";
import { IJobRole } from "@agent-xenon/interfaces";

export const createJobRole = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createJobRoleSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkRoleExist = await JobRole.findOne({ organizationId: user.organizationId, name: value.name, deletedAt: null });

        if (checkRoleExist) return res.badRequest("job role", {}, "dataAlreadyExist");

        value.organizationId = user.organizationId;
        const data = await JobRole.create(value);

        return res.ok("job role", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateJobRole = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        req.body.jobRoleId = req.params.jobRoleId;
        const { error, value } = updateJobRoleSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkRoleExist = await JobRole.findOne({ _id: value.jobRoleId, deletedAt: null });

        if (!checkRoleExist) return res.badRequest("job role", {}, "getDataNotFound");

        const checkRoleNameExist = await JobRole.findOne({ _id: { $ne: value.jobRoleId }, organizationId: user.organizationId, name: value.name, deletedAt: null });

        if (checkRoleNameExist) return res.badRequest("job role", {}, "dataAlreadyExist");

        value.organizationId = user.organizationId;
        const data = await JobRole.findByIdAndUpdate(value.jobRoleId, { $set: value }, { new: true });

        return res.ok("job role", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteJobRole = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = deleteJobRoleSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkRoleExist = await JobRole.findOne({ _id: value.jobRoleId, deletedAt: null });

        if (!checkRoleExist) return res.badRequest("job role", {}, "getDataNotFound");

        value.organizationId = user.organizationId;
        const data = await JobRole.findByIdAndUpdate(value.jobRoleId, { $set: { deletedAt: new Date() } }, { new: true });

        return res.ok("job role", data, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getJobRoles = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        Object.assign(req.query, req.params);
        const { error, value } = getJobRoleSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IJobRole> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            match.name = new RegExp(value.search, "i")
        }

        const [totalData, data] = await Promise.all([
            JobRole.countDocuments(match),
            JobRole.find(match).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("job role", { jobRoleData: data, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}