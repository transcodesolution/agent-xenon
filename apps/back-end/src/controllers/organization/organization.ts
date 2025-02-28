import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { IOrganization } from "@agent-xenon/interfaces";
import Designation from "../../database/models/designation";
import { createOrganizationSchema, deleteOrganizationSchema, getOrganizationSchema, updateOrganizationSchema } from "../../validation/organization";
import { roleModel, userModel } from "../../database";
import Organization from "../../database/models/organization";
import { generateHash } from "../../utils/password-hashing";
import Job from "../../database/models/job";
import Applicant from "../../database/models/applicant";
import InterviewRounds from "../../database/models/interview-round";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import ApplicantRounds from "../../database/models/applicant-round";
import JobRole from "../../database/models/job-role";
import InterviewQuestionAnswer from "../../database/models/interview-question-answer";
import { Permission, RoleTypes } from "@agent-xenon/constants";

export const onBoardOrganization = async (req: Request, res: Response) => {
    // reqInfo(req)
    try {
        const { error, value } = createOrganizationSchema.validate(req.body)

        if (error) {
            return res.badRequest(error?.details[0]?.message, {}, "customMessage")
        }

        const isAlready = await userModel.findOne({ email: value.email, deletedAt: null });
        if (isAlready) return res.badRequest("alreadyEmail", {});

        const checkOrganizationNameExist = await Organization.findOne({ name: value.name, deletedAt: null });

        if (checkOrganizationNameExist) return res.badRequest("organization", {}, "dataAlreadyExist");

        const response = new Organization(value);
        await response.save();

        const superAdminPermission = Object.values(Permission).filter((i) => i !== Permission.EXAM_PAGE);
        const candidatePermission = [Permission.EXAM_PAGE]

        const commonRoleDetails = { deletedAt: null, organizationId: response._id };
        const softwareRoles = [
            { type: RoleTypes.ADMINISTRATOR, ...commonRoleDetails, permissions: superAdminPermission },
            { type: RoleTypes.CANDIDATE, ...commonRoleDetails, permissions: candidatePermission },
        ];

        const roles = await roleModel.insertMany(softwareRoles);

        // if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const hashPassword = await generateHash(value.password);
        delete value.password
        value.password = hashPassword
        value.organizationId = response._id;
        value.roleId = roles.find(i => i.type === RoleTypes.ADMINISTRATOR)?._id;
        await new userModel(value).save();

        // let result: any = await email_verification_mail(response, otp);
        // if (result) {
        //     await userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
        // return res.status(200).json(new apiResponse(200, `${response}`, {}, {}));
        return res.ok("org_onboard_success", response)
        // }
        // return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
    } catch (error) {
        console.error(error);
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateOrganization = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = updateOrganizationSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = value.isEditOnBoardOrganization ? user.organizationId : value.organizationId;

        if (!value.isEditOnBoardOrganization) {
            const checkOrganizationExist = await Organization.findOne({ _id: value.organizationId, deletedAt: null });

            if (!checkOrganizationExist) return res.badRequest("organization", {}, "getDataNotFound");
        }

        const checkOrganizationNameExist = await Organization.findOne({ _id: { $ne: value.organizationId }, name: value.name, deletedAt: null });

        if (checkOrganizationNameExist) return res.badRequest("organization", {}, "dataAlreadyExist");

        const data = await Organization.findByIdAndUpdate(value.organizationId, { $set: value }, { new: true });

        return res.ok("organization", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteOrganization = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteOrganizationSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkOrganizationExist = await Organization.findOne({ _id: value.organizationId, deletedAt: null });

        if (!checkOrganizationExist) return res.badRequest("organization", {}, "getDataNotFound");

        const data = await Organization.findByIdAndUpdate(value.organizationId, { $set: { deletedAt: new Date() } }, { new: true });

        const organizationQuery: FilterQuery<{ organizationId: string }> = { organizationId: value.organizationId };
        const jobIds = await Job.distinct("_id", { organizationId: value.organizationId });
        const jobQuery: FilterQuery<{ jobId: string[] }> = { jobId: { $in: jobIds } };

        await Promise.all([
            Applicant.updateMany(organizationQuery, { $set: { deletedAt: Date.now() } }),
            Job.updateMany(jobQuery, { $set: { deletedAt: Date.now() } }),
            InterviewRounds.updateMany(jobQuery, { $set: { deletedAt: Date.now() } }),
            RoundQuestionAssign.updateMany(jobQuery, { $set: { deletedAt: Date.now() } }),
            ApplicantRounds.updateMany(jobQuery, { $set: { deletedAt: Date.now() } }),
            Designation.updateMany(organizationQuery, { $set: { deletedAt: Date.now() } }),
            JobRole.updateMany(organizationQuery, { $set: { deletedAt: Date.now() } }),
            InterviewQuestionAnswer.updateMany(organizationQuery, { $set: { deletedAt: Date.now() } }),
        ])

        return res.ok("organization", data, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getOrganization = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getOrganizationSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IOrganization> = { deletedAt: null, _id: { $ne: user.organizationId } };

        if (value.search) {
            const search = new RegExp(value.search, "i")
            match.$or = [
                { name: search },
                { description: search },
                { address: search },
            ]
        }

        const [totalData, data] = await Promise.all([
            Organization.countDocuments(match),
            Organization.find(match).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("organization", { organizationData: data, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}