import { Request, Response } from "express";
import mongoose, { AnyBulkWriteOperation, FilterQuery, QuerySelector, RootFilterQuery } from "mongoose";
import { IApplicant, IApplicantRound, IInterviewQuestion, IInterviewRound, IJob } from "@agent-xenon/interfaces";
import { AnswerQuestionFormat, ExamStatus, InterviewRoundStatus, InterviewRoundTypes, OverallResult } from "@agent-xenon/constants";
import RoundQuestionAssign from "../../database/models/round-question-assign";
import { createInterviewRoundSchema, deleteInterviewRoundSchema, getApplicantRoundByIdSchema, getExamQuestionSchema, getInterviewRoundByJobIdSchema, getInterviewRoundsByIdSchema, submitExamSchema, updateInterviewRoundSchema, updateRoundOrderSchema, updateRoundStatusSchema } from "../../validation/interview-round";
import InterviewRound from "../../database/models/interview-round";
import Job from "../../database/models/job";
import { manageMeetingRound, manageScreeningRound, manageTechnicalRound, updateApplicantStatusOnRoundComplete, updateInterviewRoundStatusAndStartDate } from "../../utils/interview-round";
import ApplicantRound from "../../database/models/applicant-round";
import { questionAnswerType, submitExamAnswerPayloadType } from "../../types/technical-round";
import { manageMCQAnswers, manageTextAndCodeAnswers } from "../../utils/technical-round";
import { sendMail } from "../../helper/mail";
import { getApplicantRoundStatusCommonQuery } from "../../utils/applicant";
import { IRoundQuestionAssign } from "../../types/round-question-assign";
import InterviewQuestion from "../../database/models/interview-question";
import ApplicantAnswer from "../../database/models/applicant-answer";
import { APPLICANT_REJECTION_TEMPLATE, APPLICANT_SELECTION_TEMPLATE } from "../../helper/email-templates/interview-status";
import { generateMailBody } from "../../utils/mail";
import { checkOutApplicantToEmployee } from "../../utils/employee";

export const createInterviewRound = async (req: Request, res: Response) => {
    try {
        const { error, value } = createInterviewRoundSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkJobExist = await Job.findOne({ _id: value.jobId, deletedAt: null });

        if (!checkJobExist) return res.badRequest("job", {}, "getDataNotFound");

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

        const interviewRoundData = await InterviewRound.updateMany(roundIdQuery, { $set: { deletedAt: new Date() } }, { new: true });

        await RoundQuestionAssign.deleteMany({ roundId: Query, jobId: jobData._id });

        return res.ok("interview round", interviewRoundData, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateRoundStatus = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        Object.assign(req.body, req.params);
        const { error, value } = updateRoundStatusSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const interviewRoundData = await InterviewRound.findOne<IInterviewRound>({ _id: value.roundId, deletedAt: null }, "name type status");

        if (!interviewRoundData) { return res.badRequest("interview round", {}, "getDataNotFound") };

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

            const html = generateMailBody({ template: value.isSelected ? APPLICANT_SELECTION_TEMPLATE : APPLICANT_REJECTION_TEMPLATE, organizationName: user.organization.name, extraData: { roundName: interviewRoundData.name, roundType: interviewRoundData.type } });

            await Promise.all([
                ApplicantRound.updateOne(Query, { $set: value }),
                sendMail(applicantRoundData.applicantId.contactInfo.email, "Candidate Interview Status Mail", html),
                checkOutApplicantToEmployee(value.applicantId, value.jobId),
            ]);

            message = "applicant round status";
        } else {
            interviewRoundData.status = value.roundStatus;
            await interviewRoundData.save();
            if (value.roundStatus === InterviewRoundStatus.COMPLETED) {
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

        const interviewRoundData = await InterviewRound.findOne<IInterviewRound<IInterviewQuestion>>(match, "type endDate startDate status qualificationCriteria selectionMarginInPercentage name");

        value.roundId = new mongoose.Types.ObjectId(value.roundId);

        const matchApplicantRoundQuery: FilterQuery<IApplicantRound> = { deletedAt: null, roundIds: { $elemMatch: { $eq: value.roundId } } };

        const applicants = await ApplicantRound.find<IApplicantRound<IApplicant>>(matchApplicantRoundQuery, {
            "status": getApplicantRoundStatusCommonQuery(value.roundId),
        }).populate("applicantId");

        const questions = await RoundQuestionAssign.find<IRoundQuestionAssign<IInterviewQuestion>>({ roundId: value.roundId, deletedAt: null }, "questionId").populate("questionId", "question description options tags difficulty timeLimitInMinutes questionFormat").sort({ _id: 1 });

        if (interviewRoundData) {
            interviewRoundData._doc.applicants = applicants;
            interviewRoundData._doc.questions = questions.map(i => i.questionId);
        }

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
        switch (interviewRoundData.type) {
            case InterviewRoundTypes.SCREENING:
                await updateInterviewRoundStatusAndStartDate(interviewRoundData, InterviewRoundStatus.ONGOING);
                res.ok("interview round is in progress. You will notify once it will complete", {}, "customMessage")
                await manageScreeningRound(interviewRoundData, user.organizationId.toString());
                break;
            case InterviewRoundTypes.ASSESSMENT:
                // if (interviewRoundData?.startDate && interviewRoundData?.endDate && (interviewRoundData.startDate <= currentDate && currentDate < interviewRoundData.endDate)) {
                //     return res.badRequest("technical round already in progress", {}, "customMessage");
                // }
                await updateInterviewRoundStatusAndStartDate(interviewRoundData, InterviewRoundStatus.ONGOING);
                await manageTechnicalRound(interviewRoundData);
                res.ok("interview round started successfully", {}, "customMessage");
                break;
            case InterviewRoundTypes.MEETING:
                await manageMeetingRound(interviewRoundData, user.organizationId, res);
        }

    } catch (error) {
        await updateInterviewRoundStatusAndStartDate(interviewRoundData, InterviewRoundStatus.YET_TO_START);
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

        await handleCandidateExamSubmission(questions, value.questionAnswers, Query, applicantRoundData.applicantId.contactInfo.email, interviewRoundData, user._id.toString(), user.organization.name);

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

        const questions = await InterviewQuestion.find<IInterviewQuestion>(
            { _id: { $in: questionAssignId } },
            "question description options.text options.index tags difficulty timeLimitInMinutes questionFormat"
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
                        from: "interviewquestions",
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

export const handleCandidateExamSubmission = async (questions: questionAnswerType[], questionAnswers: submitExamAnswerPayloadType[], applicantRoundQuery: RootFilterQuery<IApplicantRound>, applicantEmail: string, interviewRoundData: IInterviewRound, applicantId: string, organizationName: string) => {
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
            const applicantAnswerQuery = { applicantId, roundId: interviewRoundData._id };
            await ApplicantAnswer.updateOne(applicantAnswerQuery, { $push: { answers: answer }, $set: applicantAnswerQuery }, { upsert: true });
        }

        const applicantPercentage = Math.floor((correctAnswerCount / questions.length) * 100);

        const isSelected = applicantPercentage >= interviewRoundData.selectionMarginInPercentage;

        const html = generateMailBody({ template: isSelected ? APPLICANT_SELECTION_TEMPLATE : APPLICANT_REJECTION_TEMPLATE, organizationName, extraData: { roundName: interviewRoundData.name, roundType: interviewRoundData.type } });

        await Promise.all([
            ApplicantRound.updateOne(applicantRoundQuery, {
                $set: {
                    isSelected,
                    status: InterviewRoundStatus.COMPLETED
                }
            }),
            sendMail(applicantEmail, "Candidate Interview Status Mail", html),
            checkOutApplicantToEmployee(applicantId, interviewRoundData.jobId.toString()),
        ]);
    } catch (error) {
        console.error("submitExam: ", error.message);
    }
}