import { Request, Response } from "express";
import { FilterQuery, QuerySelector, RootFilterQuery } from "mongoose";
import { IApplicant, IApplicantRounds, IInterviewRounds, IJob } from "@agent-xenon/interfaces";
import { InterviewRoundStatus, InterviewRoundTypes, JobStatus, TechnicalRoundTypes } from "@agent-xenon/constants";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { createInterviewRoundSchema, deleteInterviewRoundSchema, getExamQuestionSchema, getInterviewRoundQuestionSchema, googleRedirectSchema, manageInterviewRoundSchema, submitExamSchema, updateInterviewRoundSchema } from "../../validation/interview-round";
import InterviewRounds from "../../database/models/interview-round";
import Job from "../../database/models/job";
import { IRoundQuestionAssign } from "../../types/round-question-assign";
import { manageMeetingRound, manageMeetingScheduleWithCandidate, manageScreeningRound, manageTechnicalRound } from "../../utils/interview-round";
import ApplicantRounds from "../../database/models/applicant-round";
import { questionAnswerType } from "../../types/technical-round";
import { manageMCQAnswers } from "../../utils/technical-round";
import { sendMail } from "../../helper/mail";
import { decodeEncodedToken } from "../../utils/generate-token";
import { oauth2Client } from "../../helper/third-party-oauth";
import Organization from "../../database/models/organization";
import { google } from "googleapis";

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
    const { user } = req.headers;
    try {
        const { error, value } = manageInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: RootFilterQuery<IInterviewRounds> = { _id: value.roundId, deletedAt: null };

        const interviewRoundData = await InterviewRounds.findOne<IInterviewRounds<IJob>>(Query).populate("jobId", "status");

        if (interviewRoundData.jobId._id.toString() !== value.jobId) return res.badRequest("job is invalid for this round", {}, "customMessage");

        if (interviewRoundData.status === InterviewRoundStatus.ONGOING) return res.badRequest("round already in progress", {}, "customMessage");

        if (interviewRoundData.status === InterviewRoundStatus.COMPLETED) return res.badRequest("round already completed", {}, "customMessage");

        const isFirstRound = interviewRoundData.roundNumber === 1;

        let getPreviousRoundData: IInterviewRounds;
        if (!isFirstRound) {
            getPreviousRoundData = await InterviewRounds.findOne({ jobId: interviewRoundData.jobId._id }, { _id: 1, type: 1, }).sort({ roundNumber: 1 }).limit(1);
            console.log(getPreviousRoundData)
            interviewRoundData._doc.previousRound = {
                _id: getPreviousRoundData._id.toString(),
                type: getPreviousRoundData.type
            };
        }

        // const currentDate = new Date();

        await InterviewRounds.updateOne(Query, { $set: { status: InterviewRoundStatus.ONGOING } });

        switch (interviewRoundData.type) {
            case InterviewRoundTypes.SCREENING:
                res.ok("interview round is in progress. You will notify once it will complete", {}, "customMessage")
                await manageScreeningRound(interviewRoundData, isFirstRound);
                break;
            case InterviewRoundTypes.TECHNICAL:
                // if (interviewRoundData?.startDate && interviewRoundData?.endDate && (interviewRoundData.startDate <= currentDate && currentDate < interviewRoundData.endDate)) {
                //     return res.badRequest("technical round already in progress", {}, "customMessage");
                // }
                await manageTechnicalRound(interviewRoundData, isFirstRound);
                return res.ok("interview round started successfully", {}, "customMessage");
            case InterviewRoundTypes.MEETING:
                await manageMeetingRound(interviewRoundData, isFirstRound, user.organizationId, res);
        }

    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const googleAuthRedirectLogic = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        const string = req.query.state as string;

        const [organizationId, jobId, roundId, isFirstRound] = string?.split("_") ?? [];

        const { error, value } = googleRedirectSchema.validate({ organizationId, jobId, roundId, isFirstRound });

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkOrganizationId = await Organization.findOne({ _id: value.organizationId, deletedAt: null });

        if (!checkOrganizationId) {
            return res.badRequest("organization", {}, "getDataNotFound");
        }

        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const oauth = google.oauth2({ version: "v2", auth: oauth2Client });

        const obj = await oauth.userinfo.get();

        await Organization.updateOne({ _id: organizationId }, { $set: { "serviceProviders.google": { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, scope: tokens.scope, expiry: tokens.expiry_date, email: obj.data.email } } });

        const eventDetails = await manageMeetingScheduleWithCandidate(value.jobId, value.roundId, value.isFirstRound, obj.data.email);

        return res.ok("successfully login", { eventDetails }, "customMessage");
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

        const Query: RootFilterQuery<QuerySelector<IApplicantRounds>> = {
            applicantId: user._id,
            jobId: interviewRoundData.jobId,
            roundId: interviewRoundData._id,
            isSelected: { $exists: false },
            status: InterviewRoundStatus.ONGOING
        };

        const applicantRoundData = await ApplicantRounds.findOne<IApplicantRounds<IApplicant>>(Query).populate("applicantId", "contactInfo");

        if (!applicantRoundData) {
            return res.badRequest("exam already submitted", {}, "customMessage")
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

export const getExamQuestions = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getExamQuestionSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const { roundId } = decodeEncodedToken(value.candidateToken);

        const interviewRoundData = await InterviewRounds.findOne<IInterviewRounds>({ _id: roundId, deletedAt: null });

        if (!interviewRoundData) {
            return res.badRequest("interview round", {}, "getDataNotFound")
        }

        const applicantRoundData = await ApplicantRounds.findOne<IApplicantRounds>({ roundId, deletedAt: null, applicantId: user._id, });

        const currentDate = new Date();

        if (currentDate >= interviewRoundData.endDate) {
            return res.badRequest("link expired! you are late", {}, "customMessage")
        }

        if (applicantRoundData?.status === InterviewRoundStatus.ONGOING || applicantRoundData?.status === InterviewRoundStatus.COMPLETED) {
            return res.badRequest("you have already given the exam", {}, "customMessage")
        }

        const questions = await RoundQuestionAssign.find({ deletedAt: null, roundId }, "questionId").populate("questionId", "type question description options tags difficulty timeLimitInMinutes inputFormat").sort({ _id: 1 }).skip((value.page - 1) * value.limit).limit(value.limit)

        await ApplicantRounds.create({
            applicantId: user._id,
            jobId: interviewRoundData.jobId,
            roundId: interviewRoundData._id,
            status: InterviewRoundStatus.ONGOING
        });

        return res.ok("interview questions", { roundId, questions }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}