import { ITimestamp } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

export interface IApplicantQuestionAnswer extends Document, ITimestamp {
    _id: string;
    applicantId: string | null;
    questionId: string | null;
    roundId: string | null;
    answer: string | null;
}

const ApplicantQuestionAnswerSchema: Schema = new Schema({
    applicantId: { type: Schema.Types.ObjectId },
    questionId: { type: Schema.Types.ObjectId },
    roundId: { type: Schema.Types.ObjectId },
    answer: { type: String },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const ApplicantQuestionAnswer = mongoose.model<IApplicantQuestionAnswer>('ApplicantQuestionAnswer', ApplicantQuestionAnswerSchema);

export default ApplicantQuestionAnswer;