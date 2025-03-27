import { Request, Response } from "express";
import mongoose, { AnyBulkWriteOperation, FilterQuery, QuerySelector, RootFilterQuery } from "mongoose";
import { IApplicant, IApplicantRound, IInterviewQuestionAnswer, IInterviewRound, IJob } from "@agent-xenon/interfaces";
import { AnswerQuestionFormat, App, ExamStatus, InterviewRoundStatus, InterviewRoundTypes, JobStatus, OverallResult } from "@agent-xenon/constants";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { createInterviewRoundSchema, deleteInterviewRoundSchema, getApplicantRoundByIdSchema, getExamQuestionSchema, getInterviewRoundByJobIdSchema, getInterviewRoundsByIdSchema, submitExamSchema, updateInterviewRoundSchema, updateRoundOrderSchema, updateRoundStatusSchema } from "../../validation/interview-round";
import InterviewRound from "../../database/models/interview-round";
import Job from "../../database/models/job";
import { manageMeetingRound, manageScreeningRound, manageTechnicalRound, updateApplicantStatusOnRoundComplete } from "../../utils/interview-round";
import ApplicantRound from "../../database/models/applicant-round";
import { questionAnswerType, submitExamAnswerPayloadType } from "../../types/technical-round";
import { manageMCQAnswers, manageTextAndCodeAnswers } from "../../utils/technical-round";
import { sendMail } from "../../helper/mail";
import { getApplicantRoundStatusCommonQuery, getSelectedApplicantDetails } from "../../utils/applicant";
import { IRoundQuestionAssign } from "../../types/round-question-assign";
import InterviewQuestion from "../../database/models/interview-question";
import ApplicantAnswer from "../../database/models/applicant-answer";

export const createInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = createInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");
        if (checkJobExist.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can create round right now interview is already started!", {}, "getDataNotFound");

        const interviewRoundData = await InterviewRound.create(value);

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

        const checkRoundExist = await InterviewRound.findOne<IInterviewRound<IJob>>({ _id: value.roundId, deletedAt: null }).populate("jobId", "status");

        if (!checkRoundExist) return res.badRequest("interview round", {}, "getDataNotFound");

        if (checkRoundExist.jobId.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can edit round right now interview is already started!", {}, "getDataNotFound");

        const interviewRoundData = await InterviewRound.findByIdAndUpdate(value.roundId, { $set: value }, { new: true });

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

        const checkRoundsExist = await InterviewRound.find<IInterviewRound<IJob>>({ ...roundIdQuery, deletedAt: null }).populate("jobId", "status");

        if (checkRoundsExist.length !== value.roundIds.length) return res.badRequest("interview rounds", {}, "getDataNotFound");

        const jobData = checkRoundsExist[0]?.jobId;

        if (jobData?.status === JobStatus.INTERVIEW_STARTED) return res.badRequest("can delete round right now interview is already started!", {}, "getDataNotFound");

        const interviewRoundData = await InterviewRound.updateMany(roundIdQuery, { $set: { deletedAt: new Date() } }, { new: true });

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

        let message = "round status";

        if (value.roundStatus === InterviewRoundStatus.SELECTED || value.roundStatus === InterviewRoundStatus.REJECTED) {
            const jobWiseQuery: RootFilterQuery<IApplicantRound> = { roundIds: { $elemMatch: { $eq: value.roundId } }, jobId: value.jobId, deletedAt: null };
            const Query: RootFilterQuery<IApplicantRound> = { applicantId: value.applicantId, ...jobWiseQuery };

            const applicantRoundData = await ApplicantRound.findOne<IApplicantRound<IApplicant>>(Query).populate("applicantId", "contactInfo");

            if (!applicantRoundData) return res.badRequest("applicant round", {}, "getDataNotFound");

            value.isSelected = value.roundStatus === InterviewRoundStatus.SELECTED;

            if (applicantRoundData.status !== InterviewRoundStatus.COMPLETED) {
                value.status = InterviewRoundStatus.COMPLETED;
            }

            await ApplicantRound.updateOne(Query, { $set: value });

            const selectedApplicants = await getSelectedApplicantDetails(value.jobId);
            const applicantIds = await ApplicantRound.distinct("applicantId", jobWiseQuery);
            if (selectedApplicants.length <= applicantIds.length) {
                await InterviewRound.updateOne({ _id: value.roundId }, { $set: { status: InterviewRoundStatus.COMPLETED } });
            }

            await sendMail(applicantRoundData.applicantId.contactInfo.email, "Candidate Interview Status Mail", `Dear Candidate,  

            We appreciate your time and effort in participating in the technical round for the applied position.  
            
            ${value.isSelected ? "Congratulations! You have successfully cleared the technical assessment and have been selected for the next stage of the hiring process. Our team will reach out to you with further details soon." : "We regret to inform you that you have not been selected to proceed further at this time. However, we appreciate your effort and encourage you to apply for future opportunities with us."}  
            
            Thank you for your interest in our company.`)

            message = "applicant round status";
        } else {
            await InterviewRound.updateOne({ _id: value.roundId }, { $set: { status: value.roundStatus } });
            if (value.status === InterviewRoundStatus.COMPLETED) {
                await updateApplicantStatusOnRoundComplete<string>({ $eq: value.roundId });
            }
        }

        return res.ok(message, {}, "updateDataSuccess")
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

        const match: FilterQuery<IInterviewRound> = { deletedAt: null, _id: value.roundId }

        const interviewRoundData = await InterviewRound.findOne<IInterviewRound<IInterviewQuestionAnswer>>(match, "type endDate startDate status qualificationCriteria selectionMarginInPercentage name");

        value.roundId = new mongoose.Types.ObjectId(value.roundId);

        const matchApplicantRoundQuery: FilterQuery<IApplicantRound> = { deletedAt: null, roundIds: { $elemMatch: { $eq: value.roundId } } };

        const applicants = await ApplicantRound.find<IApplicantRound<IApplicant>>(matchApplicantRoundQuery, {
            "status": getApplicantRoundStatusCommonQuery(value.roundId),
        }).populate("applicantId");

        const questions = await RoundQuestionAssign.find<IRoundQuestionAssign<IInterviewQuestionAnswer>>({ roundId: value.roundId, deletedAt: null }, "questionId").populate("questionId", "type question description options tags difficulty timeLimitInMinutes questionFormat").sort({ _id: 1 });

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

        const match: FilterQuery<IInterviewRound> = { deletedAt: null, jobId: value.jobId }

        const interviewRounds = await InterviewRound.find(match, "type endDate startDate status qualificationCriteria selectionMarginInPercentage name").sort({ _id: 1 });

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

        await InterviewRound.bulkWrite(bulkOps);

        return res.ok("interview round order", {}, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const manageInterviewRound = async (req: Request, res: Response) => {
    const { user, interviewRoundData } = req.headers;
    try {
        const currentDate = new Date();

        interviewRoundData.status = InterviewRoundStatus.ONGOING;
        interviewRoundData.startDate = currentDate;
        await interviewRoundData.save();

        switch (interviewRoundData.type) {
            case InterviewRoundTypes.SCREENING:
                res.ok("interview round is in progress. You will notify once it will complete", {}, "customMessage")
                await manageScreeningRound(interviewRoundData, user.organizationId.toString());
                break;
            case InterviewRoundTypes.ASSESSMENT:
                // if (interviewRoundData?.startDate && interviewRoundData?.endDate && (interviewRoundData.startDate <= currentDate && currentDate < interviewRoundData.endDate)) {
                //     return res.badRequest("technical round already in progress", {}, "customMessage");
                // }
                await manageTechnicalRound(interviewRoundData);
                return res.ok("interview round started successfully", {}, "customMessage");
            case InterviewRoundTypes.MEETING:
                await manageMeetingRound(interviewRoundData, user.organizationId, res);
        }

    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const submitExam = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = submitExamSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const interviewRoundData = await InterviewRound.findOne<IInterviewRound>({ _id: value.roundId, deletedAt: null });

        if (!interviewRoundData) {
            return res.badRequest("interview round", {}, "getDataNotFound")
        }

        const currentDate = new Date();

        const roundObj = { roundName: interviewRoundData.name };

        if (currentDate >= interviewRoundData.endDate || interviewRoundData.status === InterviewRoundStatus.PAUSED) {
            return res.ok("link expired! you are late", { status: ExamStatus.LINK_EXPIRED, ...roundObj }, "customMessage")
        }

        if (interviewRoundData.status === InterviewRoundStatus.COMPLETED) {
            return res.ok("round already completed", { status: ExamStatus.EXAM_COMPLETED, ...roundObj }, "customMessage");
        }

        const Query: RootFilterQuery<QuerySelector<IApplicantRound>> = {
            applicantId: user._id,
            jobId: interviewRoundData.jobId,
            roundIds: { $elemMatch: { $eq: interviewRoundData._id } },
            status: InterviewRoundStatus.ONGOING
        };

        const applicantRoundData = await ApplicantRound.findOne<IApplicantRound<IApplicant>>(Query).populate("applicantId", "contactInfo");

        if (!applicantRoundData) {
            return res.ok("you have already given the exam", { status: ExamStatus.EXAM_COMPLETED, ...roundObj }, "customMessage")
        }

        const questions = await RoundQuestionAssign.find<questionAnswerType>({ roundId: value.roundId, jobId: interviewRoundData.jobId, deletedAt: null }, "questionId").sort({ "questionId": 1 }).populate("questionId")

        res.ok("exam submitted successfully", {}, "customMessage");

        await handleCandidateExamSubmission(questions, value.questionAnswers, interviewRoundData.selectionMarginInPercentage, Query, applicantRoundData.applicantId.contactInfo.email, value.roundId, user._id.toString());

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

        const interviewRoundData = await InterviewRound.findOne<IInterviewRound>({ _id: value.roundId, deletedAt: null });

        if (!interviewRoundData) {
            return res.badRequest("interview round", {}, "getDataNotFound")
        }

        const applicantRoundData = await ApplicantRound.findOne<IApplicantRound>({ roundIds: { $elemMatch: { $eq: value.roundId } }, deletedAt: null, applicantId: user._id, });

        const currentDate = new Date();

        const roundObj = { roundName: interviewRoundData.name };

        if (currentDate >= interviewRoundData.endDate || interviewRoundData.status === InterviewRoundStatus.PAUSED) {
            return res.ok("link expired! you are late", { status: ExamStatus.LINK_EXPIRED, ...roundObj, }, "customMessage")
        }

        if (applicantRoundData?.status === InterviewRoundStatus.COMPLETED) {
            return res.ok("you have already given the exam", { status: ExamStatus.EXAM_COMPLETED, ...roundObj, }, "customMessage")
        }

        const questionAssignId: string[] = await RoundQuestionAssign.distinct("questionId", { deletedAt: null, roundId: value.roundId }).sort({ _id: 1 });

        const questions = await InterviewQuestion.find<IInterviewQuestionAnswer>(
            { _id: { $in: questionAssignId } },
            "type question description options.text options.index tags difficulty timeLimitInMinutes questionFormat"
        );

        const queryFilter = {
            applicantId: user._id,
            jobId: interviewRoundData.jobId,
        };

        if (!applicantRoundData) {
            await ApplicantRound.updateOne(queryFilter, { $set: { ...queryFilter, status: InterviewRoundStatus.ONGOING, }, $push: { roundIds: interviewRoundData._id } }, { upsert: true });
        }

        return res.ok("interview questions", { roundId: value.roundId, ...roundObj, questions }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getRoundByIdAndApplicantId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getApplicantRoundByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.roundId = new mongoose.Types.ObjectId(value.roundId);

        const [interviewRound, applicantRoundAndQuestionAnswers] = await Promise.all([
            InterviewRound.findOne({ _id: value.roundId, deletedAt: null }, "name description startDate endDate status type selectionMarginInPercentage"),
            RoundQuestionAssign.aggregate([
                {
                    $match: {
                        roundId: value.roundId
                    }
                },
                {
                    $sort:
                    {
                        questionId: 1
                    }
                },
                {
                    $lookup:
                    {
                        from: "interviewquestionanswers",
                        localField: "questionId",
                        foreignField: "_id",
                        as: "question"
                    }
                },
                {
                    $unwind: "$question"
                },
                {
                    $lookup:
                    {
                        from: "applicantanswers",
                        let: { questionId: "$question._id" },
                        as: "answer",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$applicantId", new mongoose.Types.ObjectId(value.applicantId)]
                                    }
                                }
                            },
                            {
                                $unwind: "$answers",
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$answers.questionId", "$$questionId"]
                                    }
                                }
                            },
                            {
                                $replaceRoot: {
                                    newRoot: "$answers",
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$answer",
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: ["$question", "$answer"]
                        }
                    }
                }
            ])
        ]);

        return res.ok("applicant round and question answers", { interviewRound, applicantRoundAndQuestionAnswers }, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const handleCandidateExamSubmission = async (questions: questionAnswerType[], questionAnswers: submitExamAnswerPayloadType[], selectionMarginInPercentage: number, applicantRoundQuery: RootFilterQuery<IApplicantRound>, applicantEmail: string, roundId: string, applicantId: string) => {
    try {
        let correctAnswerCount = 0;

        for (const question of questions) {
            const answer = questionAnswers.find((i: submitExamAnswerPayloadType) => question.questionId._id.toString() === i.questionId);
            switch (question.questionId.questionFormat) {
                case AnswerQuestionFormat.MCQ: {
                    const isCorrectAnswer = manageMCQAnswers(question, answer);
                    correctAnswerCount += isCorrectAnswer;
                    answer.overallResult = isCorrectAnswer ? OverallResult.Pass : OverallResult.Fail;
                    break;
                }
                case AnswerQuestionFormat.TEXT: {
                    const isCorrectAnswer = await manageTextAndCodeAnswers(question.questionId, answer);
                    correctAnswerCount += isCorrectAnswer;
                    answer.overallResult = isCorrectAnswer ? OverallResult.Pass : OverallResult.Fail;
                    break;
                }
                case AnswerQuestionFormat.CODE: {
                    const isCorrectAnswer = await manageTextAndCodeAnswers(question.questionId, answer);
                    correctAnswerCount += isCorrectAnswer;
                    answer.overallResult = isCorrectAnswer ? OverallResult.Pass : OverallResult.Fail;
                    break;
                } case AnswerQuestionFormat.FILE:
                    break;
            }
            const applicantAnswerQuery = { applicantId, roundId };
            await ApplicantAnswer.updateOne(applicantAnswerQuery, { $push: { answers: answer }, $set: applicantAnswerQuery }, { upsert: true });
        }

        const applicantPercentage = Math.floor((correctAnswerCount / questions.length) * 100);

        const isSelected = applicantPercentage >= selectionMarginInPercentage;

        await Promise.all([
            ApplicantRound.updateOne(applicantRoundQuery, {
                $set: {
                    isSelected,
                    status: InterviewRoundStatus.COMPLETED
                }
            }),
            sendMail(applicantEmail, "Candidate Interview Status Mail", `Dear Candidate,  

                We appreciate your time and effort in participating in the technical round for the applied position.  

                ${isSelected ? "Congratulations! You have successfully cleared the technical assessment and have been selected for the next stage of the hiring process. Our team will reach out to you with further details soon." : "We regret to inform you that you have not been selected to proceed further at this time. However, we appreciate your effort and encourage you to apply for future opportunities with us."}  

                Thank you for your interest in our company.`)
        ]);
    } catch (error) {
        console.error("submitExam: ", error.message);
    }
}