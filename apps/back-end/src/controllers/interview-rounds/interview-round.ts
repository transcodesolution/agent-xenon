import { Request, Response } from "express";
import mongoose, { AnyBulkWriteOperation, FilterQuery, QuerySelector, RootFilterQuery } from "mongoose";
import { IApplicant, IApplicantRounds, IInterviewQuestionAnswer, IInterviewRounds, IJob } from "@agent-xenon/interfaces";
import { ExamStatus, InterviewRoundStatus, InterviewRoundTypes, JobStatus, TechnicalRoundTypes } from "@agent-xenon/constants";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { createInterviewRoundSchema, deleteInterviewRoundSchema, getExamQuestionSchema, getInterviewRoundByJobIdSchema, getInterviewRoundsByIdSchema, googleRedirectSchema, manageInterviewRoundSchema, submitExamSchema, updateInterviewRoundSchema, updateRoundOrderSchema, updateRoundStatusSchema } from "../../validation/interview-round";
import InterviewRounds from "../../database/models/interview-round";
import Job from "../../database/models/job";
import { manageMeetingRound, manageMeetingScheduleWithCandidate, manageScreeningRound, manageTechnicalRound } from "../../utils/interview-round";
import ApplicantRounds from "../../database/models/applicant-round";
import { questionAnswerType } from "../../types/technical-round";
import { manageMCQAnswers } from "../../utils/technical-round";
import { sendMail } from "../../helper/mail";
import { oauth2Client } from "../../helper/third-party-oauth";
import Organization from "../../database/models/organization";
import { google } from "googleapis";
import { getSelectedApplicantDetails } from "../../utils/applicant";
import { IRoundQuestionAssign } from "../../types/round-question-assign";

export const createInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = createInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");
        if (checkJobExist.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can create round right now interview is already started!", {}, "getDataNotFound");

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

        let questions = await RoundQuestionAssign.distinct("questionId", { roundId: value.roundId, jobId: checkRoundExist.jobId._id });
        questions = questions.map(i => i.toString());

        value.removeQuestionIds = questions.filter((i: string) => !value.questions.includes(i));

        const jobRoundFilter: FilterQuery<IRoundQuestionAssign> = {
            jobId: checkRoundExist.jobId._id,
            roundId: interviewRoundData._id
        };

        if (value.questions?.length || 0 > 0) {
            await RoundQuestionAssign.insertMany(value.questions.map((i: string) => {
                if (!questions.includes(i)) {
                    return {
                        questionId: i,
                        ...jobRoundFilter,
                    }
                }
            }).filter(Boolean) ?? [])
        }

        if (value.removeQuestionIds.length > 0) {
            await RoundQuestionAssign.deleteMany({ questionId: { $in: value.removeQuestionIds }, ...jobRoundFilter })
        }

        return res.ok("interview round", interviewRoundData, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

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

export const updateRoundStatus = async (req: Request, res: Response) => {
    try {
        Object.assign(req.body, req.params);
        const { error, value } = updateRoundStatusSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const jobWiseQuery: RootFilterQuery<IApplicantRounds> = { roundIds: { $elemMatch: { $eq: value.roundId } }, jobId: value.jobId, deletedAt: null };
        const Query: RootFilterQuery<IApplicantRounds> = { applicantId: value.applicantId, ...jobWiseQuery };

        const applicantRoundData = await ApplicantRounds.findOne<IApplicantRounds<IApplicant>>(Query).populate("applicantId", "contactInfo");

        if (!applicantRoundData) return res.badRequest("applicant round", {}, "getDataNotFound");

        value.isSelected = value.roundStatus === InterviewRoundStatus.SELECTED;

        if (applicantRoundData.status !== InterviewRoundStatus.COMPLETED) {
            value.status = InterviewRoundStatus.COMPLETED;
        }

        await ApplicantRounds.updateOne(Query, { $set: value });

        const selectedApplicants = await getSelectedApplicantDetails(value.jobId);
        const applicantIds = await ApplicantRounds.distinct("applicantId", jobWiseQuery);
        if (selectedApplicants.length <= applicantIds.length) {
            await InterviewRounds.updateOne({ _id: value.roundId }, { $set: { status: InterviewRoundStatus.COMPLETED } });
        }

        await sendMail(applicantRoundData.applicantId.contactInfo.email, "Candidate Interview Status Mail", `Dear Candidate,  

            We appreciate your time and effort in participating in the technical round for the applied position.  
            
            ${value.isSelected ? "Congratulations! You have successfully cleared the technical assessment and have been selected for the next stage of the hiring process. Our team will reach out to you with further details soon." : "We regret to inform you that you have not been selected to proceed further at this time. However, we appreciate your effort and encourage you to apply for future opportunities with us."}  
            
            Thank you for your interest in our company.`)

        return res.ok("applicant round status", {}, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getInterviewRoundsById = async (req: Request, res: Response) => {
    try {
        const { error, value } = getInterviewRoundsByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IInterviewRounds> = { deletedAt: null, _id: value.roundId }

        const interviewRoundData = await InterviewRounds.findOne<IInterviewRounds<IInterviewQuestionAnswer>>(match, "type subType endDate startDate status qualificationCriteria mcqCriteria name");

        const matchApplicantRoundQuery: FilterQuery<IApplicantRounds> = { deletedAt: null, roundIds: { $elemMatch: { $eq: new mongoose.Types.ObjectId(value.roundId) } } };

        const checkNotCurrentRound = { $ne: [{ $arrayElemAt: ["$roundIds", -1] }, new mongoose.Types.ObjectId(value.roundId)] };

        const applicants = await ApplicantRounds.find<IApplicantRounds<IApplicant>>(matchApplicantRoundQuery, {
            "status": {
                $cond: [checkNotCurrentRound, InterviewRoundStatus.SELECTED, { $cond: [{ $eq: ["$status", InterviewRoundStatus.ONGOING] }, "$status", { $cond: ["$isSelected", InterviewRoundStatus.SELECTED, InterviewRoundStatus.REJECTED] }] }]
            },
        }).populate("applicantId");

        const questions = await RoundQuestionAssign.find<IRoundQuestionAssign<IInterviewQuestionAnswer>>({ roundId: value.roundId, deletedAt: null }, "questionId").populate("questionId", "type question description options tags difficulty timeLimitInMinutes inputFormat").sort({ _id: 1 });

        interviewRoundData._doc.applicants = applicants;
        interviewRoundData._doc.questions = questions.map(i => i.questionId);

        return res.ok("interview round", interviewRoundData ?? {}, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getInterviewRoundByJobId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getInterviewRoundByJobIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IInterviewRounds> = { deletedAt: null, jobId: value.jobId }

        const interviewRounds = await InterviewRounds.find(match, "type subType endDate startDate status qualificationCriteria mcqCriteria name").sort({ _id: 1 });

        return res.ok("interview round", interviewRounds, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateRoundOrder = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateRoundOrderSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const bulkOps: AnyBulkWriteOperation[] = value.roundOrderIds.map((roundId: string, index: number) => ({
            updateOne: {
                filter: { _id: roundId },
                update: { $set: { roundNumber: index + 1 } }
            }
        }));

        await InterviewRounds.bulkWrite(bulkOps);

        return res.ok("interview round", {}, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const manageInterviewRound = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = manageInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: RootFilterQuery<IInterviewRounds> = { jobId: value.jobId, deletedAt: null };

        const interviewRounds = await InterviewRounds.find<IInterviewRounds<IJob>>(Query).sort({ roundNumber: 1 }).populate("jobId", "status");

        const interviewRoundData = interviewRounds.find(i => i._id.toString() === value.roundId);
        const previousInterviewRoundData = interviewRounds.slice(0, interviewRounds.findIndex(i => i._id.toString() === value.roundId)).pop();

        if (interviewRoundData?.jobId._id.toString() !== value.jobId) return res.badRequest("job is invalid for this round", {}, "customMessage");

        if (interviewRoundData.status === InterviewRoundStatus.ONGOING) return res.badRequest("round already in progress", {}, "customMessage");

        if (interviewRoundData.status === InterviewRoundStatus.COMPLETED) return res.badRequest("round already completed", {}, "customMessage");

        if (previousInterviewRoundData && previousInterviewRoundData.status !== InterviewRoundStatus.COMPLETED) return res.badRequest("previous round is not completed", {}, "customMessage");

        const currentDate = new Date();

        interviewRoundData.status = InterviewRoundStatus.ONGOING;
        interviewRoundData.startDate = currentDate;
        await interviewRoundData.save();

        switch (interviewRoundData.type) {
            case InterviewRoundTypes.SCREENING:
                res.ok("interview round is in progress. You will notify once it will complete", {}, "customMessage")
                await manageScreeningRound(interviewRoundData, user.organizationId.toString());
                break;
            case InterviewRoundTypes.TECHNICAL:
                // if (interviewRoundData?.startDate && interviewRoundData?.endDate && (interviewRoundData.startDate <= currentDate && currentDate < interviewRoundData.endDate)) {
                //     return res.badRequest("technical round already in progress", {}, "customMessage");
                // }
                await manageTechnicalRound(interviewRoundData);
                return res.ok("interview round started successfully", {}, "customMessage");
            case InterviewRoundTypes.MEETING:
                await manageMeetingRound(interviewRoundData, user.organizationId, res);
        }

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error === "invalid_grant") {
            console.error("Refresh token expired or revoked. User needs to re-authenticate.");

            // Redirect user for authentication
            const redirectUrl = oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/calendar",
                    "https://www.googleapis.com/auth/userinfo.email",
                ],
                prompt: "consent",  // Ensures user grants a new refresh token
            });

            return res.ok("Google login required! Please redirect using the given URL", { redirectUrl }, "customMessage");
        } else {
            console.error("Error refreshing access token:", error);
            return res.internalServerError(error.message, error.stack, "customMessage")
        }
    }
}

export const googleAuthRedirectLogic = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        const string = req.query.state as string;

        const [organizationId, jobId, roundId] = string?.split("_") ?? [];

        const { error, value } = googleRedirectSchema.validate({ organizationId, jobId, roundId });

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkOrganizationId = await Organization.findOne({ _id: value.organizationId, deletedAt: null });

        if (!checkOrganizationId) {
            return res.badRequest("organization", {}, "getDataNotFound");
        }

        if (checkOrganizationId.serviceProviders.google.expiry > new Date()) {
            return res.badRequest("You have already logged in with google. Can't perform multiple times", {}, "customMessage");
        }

        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const oauth = google.oauth2({ version: "v2", auth: oauth2Client });

        const obj = await oauth.userinfo.get();

        await Organization.updateOne({ _id: organizationId }, { $set: { "serviceProviders.google": { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, scope: tokens.scope, expiry: tokens.expiry_date, email: obj.data.email } } });

        res.ok("successfully login and meeting round is started successfully", {}, "customMessage");
        await manageMeetingScheduleWithCandidate(value.jobId, obj.data.email, value.roundId);
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage");
    }
}

export const submitExam = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = submitExamSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const interviewRoundData = await InterviewRounds.findOne<IInterviewRounds>({ _id: value.roundId, deletedAt: null });

        if (!interviewRoundData) {
            return res.badRequest("interview round", {}, "getDataNotFound")
        }

        if (interviewRoundData.status === InterviewRoundStatus.COMPLETED) {
            return res.badRequest("round already completed", { status: ExamStatus.EXAM_COMPLETED }, "customMessage");
        }

        const Query: RootFilterQuery<QuerySelector<IApplicantRounds>> = {
            applicantId: user._id,
            jobId: interviewRoundData.jobId,
            roundIds: { $elemMatch: { $eq: interviewRoundData._id } },
            isSelected: { $exists: false },
            status: InterviewRoundStatus.ONGOING
        };

        const applicantRoundData = await ApplicantRounds.findOne<IApplicantRounds<IApplicant>>(Query).populate("applicantId", "contactInfo");

        if (!applicantRoundData) {
            return res.badRequest("you have already given the exam", { status: ExamStatus.EXAM_COMPLETED }, "customMessage")
        }

        const questions = await RoundQuestionAssign.find<questionAnswerType>({ roundId: value.roundId, jobId: interviewRoundData.jobId, deletedAt: null }, "questionId").populate("questionId")

        let isSelected: boolean;

        switch (interviewRoundData.subType) {
            case TechnicalRoundTypes.MCQ:
                isSelected = manageMCQAnswers(questions, value.questionAnswers, interviewRoundData.mcqCriteria);
                break;
            case TechnicalRoundTypes.DSA:
                // in future, the logic will implement here using AI agent
                break;
            case TechnicalRoundTypes.CODING:
                // in future, the logic will implement here using AI agent
                break;
        }

        await Promise.all([
            ApplicantRounds.updateOne(Query, {
                $set: {
                    isSelected,
                    status: InterviewRoundStatus.COMPLETED
                }
            }),
            sendMail(applicantRoundData.applicantId.contactInfo.email, "Candidate Interview Status Mail", `Dear Candidate,  

                We appreciate your time and effort in participating in the technical round for the applied position.  
                
                ${isSelected ? "Congratulations! You have successfully cleared the technical assessment and have been selected for the next stage of the hiring process. Our team will reach out to you with further details soon." : "We regret to inform you that you have not been selected to proceed further at this time. However, we appreciate your effort and encourage you to apply for future opportunities with us."}  
                
                Thank you for your interest in our company.`)
        ]);

        return res.ok("exam submitted successfully", {}, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getExamQuestionsByRoundId = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getExamQuestionSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const interviewRoundData = await InterviewRounds.findOne<IInterviewRounds>({ _id: value.roundId, deletedAt: null });

        if (!interviewRoundData) {
            return res.badRequest("interview round", {}, "getDataNotFound")
        }

        const applicantRoundData = await ApplicantRounds.findOne<IApplicantRounds>({ roundIds: { $elemMatch: { $eq: value.roundId } }, deletedAt: null, applicantId: user._id, });

        const currentDate = new Date();

        if (currentDate >= interviewRoundData.endDate) {
            return res.ok("link expired! you are late", { status: ExamStatus.LINK_EXPIRED }, "customMessage")
        }

        if (applicantRoundData?.status === InterviewRoundStatus.COMPLETED) {
            return res.ok("you have already given the exam", { status: ExamStatus.EXAM_COMPLETED }, "customMessage")
        }

        const questions = await RoundQuestionAssign.find({ deletedAt: null, roundId: value.roundId }, "questionId").populate("questionId", "type question description options tags difficulty timeLimitInMinutes inputFormat").sort({ _id: 1 });

        const queryFilter = {
            applicantId: user._id,
            jobId: interviewRoundData.jobId,
        };

        if (!applicantRoundData) {
            await ApplicantRounds.updateOne(queryFilter, { $set: { ...queryFilter, status: InterviewRoundStatus.ONGOING, }, $push: { roundIds: interviewRoundData._id } }, { upsert: true });
        }

        return res.ok("interview questions", { roundId: value.roundId, questions }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}