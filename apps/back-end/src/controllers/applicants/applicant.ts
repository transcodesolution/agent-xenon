import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { IApplicant } from "@agent-xenon/interfaces";
import { createApplicantByAgentSchema, createApplicantByUserSchema, deleteApplicantSchema, getApplicantSchema, updateApplicantSchema } from "../../validation/applicant";
import Applicant from "../../database/models/applicant";
import ApplicantRounds from "../../database/models/applicant-round";
import Job from "../../database/models/job";
import uploadResumesAgent from "../../agents/resume-extract-info";
import { InterviewRoundStatus, JobStatus, RoleTypes } from "@agent-xenon/constants";
import { roleModel } from "../../database";

export const createApplicantByUser = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createApplicantByUserSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkApplicantExist = await Applicant.findOne({ jobId: value.jobId, deletedAt: null, "contactInfo.email": value.contactInfo.email });

        if (checkApplicantExist) return res.badRequest("alreadyEmail", {});

        value.organizationId = user.organizationId;
        const data = await Applicant.create(value);

        return res.ok("applicant", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const createApplicantByAgent = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createApplicantByAgentSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null, status: JobStatus.OPEN });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");

        const roleData = await roleModel.findOne({ name: RoleTypes.CANDIDATE, deletedAt: null });
        const data = await uploadResumesAgent(value.resumeUrls, user.organizationId, value.jobId, roleData._id.toString());

        await Applicant.insertMany(data);

        return res.ok("applicant", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateApplicant = async (req: Request, res: Response) => {
    try {
        req.body.applicantId = req.params.applicantId;
        const { error, value } = updateApplicantSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkApplicantExist = await Applicant.findOne({ _id: value.applicantId, deletedAt: null });

        if (!checkApplicantExist) return res.badRequest("applicant", {}, "getDataNotFound");

        const checkApplicantEmailExist = await Applicant.findOne({ _id: { $ne: value.applicantId }, jobId: value.jobId, deletedAt: null, "contactInfo.email": value.contactInfo.email });

        if (checkApplicantEmailExist) return res.badRequest("alreadyEmail", {});

        const data = await Applicant.findByIdAndUpdate(value.applicantId, { $set: value }, { new: true });

        return res.ok("applicant", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteApplicant = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = deleteApplicantSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkApplicantExist = await Applicant.findOne({ _id: value.applicantId, deletedAt: null });

        if (!checkApplicantExist) return res.badRequest("applicant", {}, "getDataNotFound");

        value.organizationId = user.organizationId;
        const data = await Applicant.findByIdAndUpdate(value.applicantId, { $set: { deletedAt: new Date() } }, { new: true });

        await ApplicantRounds.updateMany({ applicantId: value.applicantId, jobId: checkApplicantExist.jobId }, { $set: { deletedAt: new Date() } });

        return res.ok("applicant", data, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getApplicants = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getApplicantSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IApplicant> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            const search = new RegExp(value.search, "i");
            match.$or = [
                { firstName: search },
                { lastName: search },
                { summary: search },
            ]
        }

        if (value.jobId) {
            match.jobId = value.jobId;
        }

        const selectRejectQuery = value.isSelectedByAgent || !value.isSelectedByAgent;

        if (value.roundId || selectRejectQuery) {
            const applicantIds = await ApplicantRounds.distinct("applicantId", { ...(value.roundId && { roundId: value.roundId }), ...(selectRejectQuery && { isSelected: value.isSelectedByAgent }), deletedAt: null, status: InterviewRoundStatus.COMPLETED });
            match._id = { $in: applicantIds };
        }

        const [totalData, data] = await Promise.all([
            Applicant.countDocuments(match),
            Applicant.find(match).sort({ _id: -1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("applicant", { applicantData: data, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}