import { Request, Response } from "express";
import mongoose, { FilterQuery, QuerySelector } from "mongoose";
import { IApplicant } from "@agent-xenon/interfaces";
import { createApplicantByAgentSchema, createApplicantByUserSchema, deleteApplicantSchema, getApplicantByIdSchema, getApplicantSchema, updateApplicantSchema } from "../../validation/applicant";
import Applicant from "../../database/models/applicant";
import ApplicantRound from "../../database/models/applicant-round";
import Job from "../../database/models/job";
import { InterviewRoundStatus, JobStatus, RoleType } from "@agent-xenon/constants";
import { Role } from "../../database";
import { resumeExtractAgent } from "../../helper/queue";
import { getApplicantRoundStatusCommonQuery } from "../../utils/applicant";

export const createApplicantByUser = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createApplicantByUserSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkApplicantExist = await Applicant.findOne({ jobId: value.jobId, deletedAt: null, "contactInfo.email": value.contactInfo.email });

        if (checkApplicantExist) return res.badRequest("alreadyEmail", {});

        const roleData = await Role.findOne({ type: RoleType.CANDIDATE, deletedAt: null, organizationId: user.organizationId });

        value.organizationId = user.organizationId;
        value.roleId = roleData._id.toString();
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

        const roleData = await Role.findOne({ type: RoleType.CANDIDATE, deletedAt: null, organizationId: user.organizationId });
        value.resumeUrls = checkJobExist.resumeUrls;
        value.organizationId = user.organizationId;
        value.roleId = roleData._id.toString();

        await resumeExtractAgent.add("resumeExtractAgent", value);

        checkJobExist.resumeUrls = [];
        await checkJobExist.save();

        return res.ok("applicant resume extract process is in progress!", {}, "customMessage")
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
        const { error, value } = deleteApplicantSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const condition: QuerySelector<IApplicant> = { $in: value.applicantIds };

        const match: FilterQuery<IApplicant> = { _id: condition, deletedAt: null };

        const checkApplicantsExist = await Applicant.find(match);

        if (checkApplicantsExist.length !== value.applicantIds.length) return res.badRequest("applicant", {}, "getDataNotFound");

        value.organizationId = user.organizationId;
        const deletedApplicants = await Applicant.findOneAndUpdate(match, { $set: { deletedAt: new Date() } }, { new: true });

        await ApplicantRound.updateMany({ applicantId: condition, jobId: checkApplicantsExist[0].jobId }, { $set: { deletedAt: new Date() } });

        return res.ok("applicants", deletedApplicants, "deleteDataSuccess")
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

        const selectRejectQuery = value.isSelectedByAgent || value.isSelectedByAgent === false;

        if (value.roundId || selectRejectQuery) {
            const applicantIds = await ApplicantRound.distinct("applicantId", { ...(value.roundId && { roundIds: { $elemMatch: { $eq: value.roundId } } }), ...(selectRejectQuery && { isSelected: value.isSelectedByAgent }), deletedAt: null, status: InterviewRoundStatus.COMPLETED });
            match._id = { $in: applicantIds };
        }

        const [totalData, applicants] = await Promise.all([
            Applicant.countDocuments(match),
            Applicant.find(match).sort({ _id: -1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("applicant", { applicants, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getApplicantById = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getApplicantByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IApplicant> = { deletedAt: null, organizationId: user.organizationId, _id: value.applicantId };

        const applicantData = await Applicant.findOne<IApplicant>(match);

        return res.ok("applicant", applicantData ?? {}, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getApplicantInterviewDetail = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getApplicantByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const applicantInterviewRounds = await Applicant.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(value.applicantId)
                }
            },
            {
                $lookup: {
                    from: "interviewrounds",
                    localField: "jobId",
                    foreignField: "jobId",
                    as: "interviewRound",
                    pipeline: [
                        {
                            $sort: {
                                roundNumber: 1
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                description: 1,
                                type: 1,
                                status: 1,
                                startDate: 1,
                                endDate: 1,
                                selectionMarginInPercentage: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$interviewRound",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "applicantrounds",
                    let: { roundId: "$interviewRound._id" },
                    localField: "interviewRound._id",
                    foreignField: "roundIds",
                    as: "applicantRound",
                    pipeline: [
                        {
                            $match: {
                                applicantId: user._id
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                applicantStatus: getApplicantRoundStatusCommonQuery("$$roundId")
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$applicantRound",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    "applicantRound.applicantStatus": {
                        $ifNull: [
                            "$applicantRound.applicantStatus",
                            InterviewRoundStatus.YET_TO_START
                        ]
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$interviewRound",
                            "$applicantRound"
                        ]
                    }
                }
            }
        ]);

        return res.ok("applicant interview rounds", { applicantInterviewRounds }, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}