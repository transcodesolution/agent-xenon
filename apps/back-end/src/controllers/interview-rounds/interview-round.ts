import { Request, Response } from "express";
import { FilterQuery, QuerySelector } from "mongoose";
import { IInterviewRounds, IJob } from "@agent-xenon/interfaces";
import { InterviewRoundTypes, JobStatus } from "@agent-xenon/constants";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { createInterviewRoundSchema, deleteInterviewRoundSchema, getInterviewRoundQuestionSchema, manageInterviewRoundSchema, updateInterviewRoundSchema } from "../../validation/interview-round";
import InterviewRounds from "../../database/models/interview-round";
import Job from "../../database/models/job";
import { IRoundQuestionAssign } from "../../types/round-question-assign";
import { manageScreeningRound } from "../../utils/interview-round";

export const createInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = createInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");
        if (checkJobExist.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can create round right now interview is already started!", {}, "getDataNotFound");

        const count = await InterviewRounds.countDocuments({ jobId: value.jobId, deletedAt: null })

        value.roundNumber = count + 1;
        const interviewRoundData = await InterviewRounds.create(value);

        await RoundQuestionAssign.insertMany(value.questions.map((i: string) => ({
            questionId: i,
            jobId: checkJobExist._id,
            roundId: interviewRoundData._id
        })))

        return res.ok("interview round", interviewRoundData, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateInterviewRound = async (req: Request, res: Response) => {
    try {
        req.body.roundId = req.params.roundId;
        const { error, value } = updateInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkRoundExist = await InterviewRounds.findOne<IInterviewRounds<IJob>>({ _id: value.roundId, deletedAt: null }).populate("jobId", "status");

        if (!checkRoundExist) return res.badRequest("interview round", {}, "getDataNotFound");

        if (checkRoundExist.jobId.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can edit round right now interview is already started!", {}, "getDataNotFound");

        const interviewRoundData = await InterviewRounds.findByIdAndUpdate(value.roundId, { $set: value }, { new: true });

        if (value.newQuestionIds.length > 0) {
            await RoundQuestionAssign.insertMany(value.newQuestionIds.map((i: string) => ({
                questionId: i,
                jobId: checkRoundExist.jobId._id,
                roundId: interviewRoundData._id
            })))
        }

        if (value.removeQuestionIds.length > 0) {
            await RoundQuestionAssign.deleteMany({ _id: { $in: value.removeQuestionIds } })
        }

        return res.ok("interview round", interviewRoundData, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteInterviewRoundSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.roundIds = value.roundIds.split("_");

        const Query: QuerySelector<Array<string>> = { $in: value.roundIds };

        const roundIdQuery = { _id: Query };

        const checkRoundsExist = await InterviewRounds.find<IInterviewRounds<IJob>>({ ...roundIdQuery, deletedAt: null }).populate("jobId", "status");

        if (checkRoundsExist.length !== value.roundIds.length) return res.badRequest("interview rounds", {}, "getDataNotFound");

        const jobData = checkRoundsExist[0]?.jobId;

        if (jobData?.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can delete round right now interview is already started!", {}, "getDataNotFound");

        const interviewRoundData = await InterviewRounds.updateMany(roundIdQuery, { $set: { deletedAt: new Date() } }, { new: true });

        await RoundQuestionAssign.deleteMany({ roundId: Query, jobId: jobData._id });

        return res.ok("interview round", interviewRoundData, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getInterviewRoundQuestions = async (req: Request, res: Response) => {
    try {
        const { error, value } = getInterviewRoundQuestionSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IRoundQuestionAssign> = { deletedAt: null, jobId: value.jobId, roundId: value.roundId }

        if (value.search) {
            match["questionId.name"] = new RegExp(value.search, "i");
        }

        const [totalData, interviewRoundData] = await Promise.all([
            RoundQuestionAssign.countDocuments(match),
            RoundQuestionAssign.find(match).populate("questionId").sort({ _id: 1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ])

        return res.ok("interview questions", { interviewRoundData, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const manageInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = manageInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const interviewRoundData = await InterviewRounds.findOne<IInterviewRounds<IJob>>({ _id: value.roundId, deletedAt: null }).populate("jobId", "status");

        if (interviewRoundData.jobId._id.toString() !== value.jobId) return res.badRequest("job is invalid for this round", {}, "customMessage");

        switch (interviewRoundData.type) {
            case InterviewRoundTypes.SCREENING:
                await manageScreeningRound(interviewRoundData);
                break;
            case InterviewRoundTypes.TECHNICAL:
                break;
            case InterviewRoundTypes.MEETING:
                break;
        }

        return res.ok("interview round started successfully", {}, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}