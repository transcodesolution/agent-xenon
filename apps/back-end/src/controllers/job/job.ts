import { Request, Response } from "express";
import mongoose, { FilterQuery, RootFilterQuery, } from "mongoose";
import { addResumeLinkSchema, createJobSchema, deleteJobSchema, deleteResumeLinkSchema, getJobByIdSchema, getJobSchema, getResumeLinkSchema, updateJobSchema } from "../../validation/job";
import Job from "../../database/models/job";
import InterviewRound from "../../database/models/interview-round";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { IInterviewRound, IJob } from "@agent-xenon/interfaces";
import Applicant from "../../database/models/applicant";
import ApplicantRound from "../../database/models/applicant-round";
import { IRoundQuestionAssign } from "../../types/round-question-assign";
import { JobStatus } from "@agent-xenon/constants";
import { JobQueryType } from "../../types/job";
import Designation from "../../database/models/designation";
import JobRole from "../../database/models/job-role";
import { s3deleteObjects } from "../../utils/s3";

export const createJob = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createJobSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        value.qualificationCriteria = value.screeningCriteria;
        const data = await Job.create(value);

        const rounds = await InterviewRound.insertMany(value.rounds?.map((i: IInterviewRound) => {
            i.jobId = data._id;
            return i;
        }) ?? []);

        const obj: Partial<IRoundQuestionAssign> = { jobId: data._id };

        const questionAssigns = rounds.flatMap((i: IInterviewRound) => {
            const roundDetail = value.rounds.find((j: IInterviewRound) => (j.roundNumber === i.roundNumber));
            obj.roundId = i._id;
            return roundDetail.questions.map((k: string) => ({ questionId: k, ...obj }));
        });

        await RoundQuestionAssign.insertMany(questionAssigns);

        return res.ok("job", data, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateJob = async (req: Request, res: Response) => {
    try {
        req.body.jobId = req.params.jobId;
        const { error, value } = updateJobSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");

        if (checkJobExist.status === JobStatus.INTERVIEW_STARTED) { return res.badRequest("could not edit job right now as already interview started!", {}, "customMessage"); }

        if (value?.screeningCriteria) {
            value.qualificationCriteria = value.screeningCriteria;
        }

        const data = await Job.findByIdAndUpdate(value.jobId, { $set: value }, { new: true });

        return res.ok("job", data, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteJobSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        let jobQuery: JobQueryType | { jobId: JobQueryType } = { $in: value.jobIds };

        const checkJobExist = await Job.find({ _id: jobQuery, deletedAt: null });

        if (checkJobExist.length !== value.jobIds.length) return res.badRequest("job", {}, "getDataNotFound");

        if (checkJobExist.some((i) => i.status === JobStatus.INTERVIEW_STARTED)) { return res.badRequest("could not delete jobs right now as some jobs already has interview started!", {}, "customMessage"); }

        const jobsUpdateResult = await Job.updateMany({ _id: jobQuery }, { $set: { deletedAt: new Date() } }, { new: true });

        jobQuery = { jobId: jobQuery };

        await Promise.all([
            Applicant.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
            ApplicantRound.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
            InterviewRound.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
            RoundQuestionAssign.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
        ])

        return res.ok("job", jobsUpdateResult, "deleteDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getJob = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getJobSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IJob> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            const search = new RegExp(value.search, "i")
            match.$or = [
                { title: search },
                { description: search },
            ]
        }

        if (value.role) {
            match.role = value.role;
        }

        if (value.designation) {
            match.designation = value.designation;
        }

        const [totalData, jobs] = await Promise.all([
            Job.countDocuments(match),
            Job.find(match).populate("role", "name").populate("designation", "name").sort({ _id: -1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ]);

        return res.ok("job", { jobs, totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getJobRoleAndDesignation = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const match: FilterQuery<IJob> = { deletedAt: null, organizationId: user.organizationId }

        const [jobRoles, designations] = await Promise.all([
            JobRole.find(match, "name").sort({ _id: -1 }),
            Designation.find(match, "name").sort({ _id: -1 }),
        ]);

        return res.ok("job role and designation", { jobRoles, designations }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getJobById = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        Object.assign(req.query, req.params);
        const { error, value } = getJobByIdSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IJob> = { deletedAt: null, organizationId: new mongoose.Types.ObjectId(user.organizationId), _id: new mongoose.Types.ObjectId(value.jobId as string) };

        const [job] = await Job.aggregate<IPagination<IJob>>([
            {
                $match: match,
            },
            {
                $lookup: {
                    from: "interviewrounds",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "rounds",
                    pipeline: [{ $match: { deletedAt: null } }, { $sort: { roundNumber: 1 } }, { $project: { type: 1, endDate: 1, startDate: 1, qualificationCriteria: 1, roundNumber: 1, selectionMarginInPercentage: 1, status: 1, name: 1 } }]
                }
            },
            {
                $lookup: {
                    from: "designations",
                    localField: "designation",
                    foreignField: "_id",
                    as: "designationData",
                }
            },
            {
                $unwind: {
                    path: "$designationData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "jobroles",
                    localField: "role",
                    foreignField: "_id",
                    as: "roleData",
                }
            },
            {
                $unwind: {
                    path: "$roleData",
                    preserveNullAndEmptyArrays: true
                }
            },
        ])

        if (!job) {
            return res.badRequest("job", job, "getDataNotFound");
        }

        return res.ok("job", job, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const addResumeUrl = async (req: Request, res: Response) => {
    try {
        const { error, value } = addResumeLinkSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) {
            return res.badRequest("job", {}, "getDataNotFound");
        }

        await Job.updateOne({ _id: value.jobId }, { $push: { resumeUrls: value.resumeUrls } });

        return res.ok("resume links", { resumeUrls: value.resumeUrls }, "addDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage");
    }
}

export const getResumesUrlsByJobId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getResumeLinkSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const resumeUrls = await Job.findOne({ _id: value.jobId, deletedAt: null }, "resumeUrls");

        return res.ok("resume link", resumeUrls ?? {}, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteResumeUrls = async (req: Request, res: Response) => {
    try {
        Object.assign(req.query, req.params);
        const { error, value } = deleteResumeLinkSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: RootFilterQuery<IJob> = { _id: value.jobId, deletedAt: null };

        const checkJobExist = await Job.findOne(Query);

        if (!checkJobExist) {
            return res.badRequest("job", {}, "getDataNotFound");
        }

        await s3deleteObjects([value.resumeUrl]);

        const resumeUrls = await Job.findOneAndUpdate(Query, { $pull: { resumeUrls: value.resumeUrl } }, { new: true });

        return res.ok("resume link", resumeUrls, "deleteDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage");
    }
}