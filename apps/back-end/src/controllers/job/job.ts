import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { createJobSchema, deleteJobSchema, getJobSchema, updateJobSchema } from "../../validation/job";
import Job from "../../database/models/job";
import InterviewRounds from "../../database/models/interview-round";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { IInterviewRounds, IJob } from "@agent-xenon/interfaces";
import { JOB_STATUS } from "@agent-xenon/constants";
import Applicant from "../../database/models/applicant";
import ApplicantRounds from "../../database/models/applicant-round";
import { IRoundQuestionAssign } from "../../types/round-question-assign";

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

        const rounds = await InterviewRounds.insertMany(value.rounds?.map((i: IInterviewRounds) => {
            i.jobId = data._id;
            return i;
        }) ?? []);

        const obj: Partial<IRoundQuestionAssign> = { jobId: data._id };

        const questionAssigns = rounds.flatMap((i: IInterviewRounds) => {
            const roundDetail = value.rounds.find((j: IInterviewRounds) => (j.roundNumber === i.roundNumber));
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

        if (checkJobExist.status === JOB_STATUS.INTERVIEW_STARTED) { return res.badRequest("could not edit job right now as already interview started!", {}, "customMessage"); }

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
        const { error, value } = deleteJobSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");

        if (checkJobExist.status === JOB_STATUS.INTERVIEW_STARTED) { return res.badRequest("could not delete job right now as already interview started!", {}, "customMessage"); }

        const data = await Job.findByIdAndUpdate(value.jobId, { $set: { deletedAt: new Date() } }, { new: true });

        const jobQuery: FilterQuery<{ jobId: string }> = { jobId: data._id };

        await Promise.all([
            Applicant.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
            ApplicantRounds.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
            InterviewRounds.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
            RoundQuestionAssign.updateMany(jobQuery, { $set: { deletedAt: new Date() } }),
        ])

        return res.ok("job", data, "deleteDataSuccess")
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

        const [data] = await Job.aggregate<IPagination<IJob>>([
            {
                $match: match
            },
            {
                $lookup: {
                    from: "interviewrounds",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "rounds",
                    pipeline: [{ $sort: { roundNumber: 1 } }, { $project: { type: 1, durationInSeconds: 1, qualificationCriteria: 1, roundNumber: 1 } }]
                }
            },
            {
                $facet: {
                    data: [
                        { $sort: { _id: -1 } },
                        { $skip: (value.page - 1) * value.limit },
                        { $limit: value.limit },
                    ],
                    totalData: [{ $count: "count" }]
                }
            },
            {
                $project: {
                    totalData: { $arrayElemAt: ["$totalData.count", 0] },
                    data: "$data",
                }
            }
        ])

        return res.ok("job", { jobData: data.data, totalData: data.totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(data.totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}