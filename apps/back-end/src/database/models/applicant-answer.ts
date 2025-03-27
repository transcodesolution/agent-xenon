import { OverallResult } from "@agent-xenon/constants";
import { IApplicantAnswer } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

const ApplicantAnswerSchema: Schema = new Schema({
    applicantId: { type: Schema.Types.ObjectId },
    answers: { type: [{ questionId: { type: Schema.Types.ObjectId }, answer: { type: String }, overallResult: { type: String, enum: OverallResult } }] },
    roundId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const ApplicantAnswer = mongoose.model<IApplicantAnswer>('ApplicantAnswer', ApplicantAnswerSchema);

export default ApplicantAnswer;