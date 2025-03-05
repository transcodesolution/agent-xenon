import { InterviewRoundStatus, Permission, RoleType } from "@agent-xenon/constants";
import { NextFunction, Request, Response } from "express";
import { FileDataType } from "../types/response-data";
import { IInterviewRound, IJob } from "@agent-xenon/interfaces";
import { RootFilterQuery } from "mongoose";
import InterviewRound from "../database/models/interview-round";
import { manageInterviewRoundSchema } from "../validation/interview-round";

export const validateRoleAndPermissions = (permissions: Permission[]) => async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.headers;
    try {
        if (typeof user.roleId !== "string") {
            if (user.roleId.type === RoleType.ADMINISTRATOR) {
                return next();
            }

            if (permissions.find((permission) => user.roleId.permissions.includes(permission))) {
                return next();
            }
            return res.forbidden("invalidAction", {})
        }
    } catch (error) {
        console.error("validateRoleAndPermissions: ", error)
        return res.unAuthorizedAccess("unauthorized", {})
    }
}

export const sendS3DocumentLinks = async (req: Request, res: Response) => {
    try {
        const fileObject = req.files as FileDataType[] ?? [];

        return res.ok("resumes uploaded successfully", { resumeUrls: fileObject.map((i) => (i.location)) }, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const validateInterviewRound = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = manageInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: RootFilterQuery<IInterviewRound> = { jobId: value.jobId, deletedAt: null };

        const interviewRound = await InterviewRound.find<IInterviewRound<IJob>>(Query).sort({ roundNumber: 1 }).populate("jobId", "status");

        const interviewRoundData = interviewRound.find(i => i._id.toString() === value.roundId);
        const previousInterviewRoundData = interviewRound.slice(0, interviewRound.findIndex(i => i._id.toString() === value.roundId)).pop();

        if (interviewRoundData?.jobId._id.toString() !== value.jobId) { return res.badRequest("job is invalid for this round", {}, "customMessage"); }

        if (interviewRoundData.status === InterviewRoundStatus.ONGOING) { return res.badRequest("round already in progress", {}, "customMessage"); }

        if (interviewRoundData.status === InterviewRoundStatus.PAUSED) { return res.badRequest("round already in paused", {}, "customMessage"); }

        if (interviewRoundData.status === InterviewRoundStatus.COMPLETED) { return res.badRequest("round already completed", {}, "customMessage"); }

        if (previousInterviewRoundData && previousInterviewRoundData.status !== InterviewRoundStatus.COMPLETED) { return res.badRequest("previous round is not completed", {}, "customMessage"); }

        req.headers.interviewRoundData = interviewRoundData;
        next();
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}