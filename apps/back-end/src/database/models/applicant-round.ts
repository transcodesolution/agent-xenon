import { APPLICANT_ROUND_TYPES } from "@agent-xenon/constants";
import { ITimestamp } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

export interface IApplicantRounds extends Document, ITimestamp {
    _id: string;
    roundId: string | null;
    status: string | null;
    jobId: string | null;
    applicantId: string | null;
    isSelected: boolean | null;
    lastQuestionId: string | null;
}

const ApplicantRoundsSchema: Schema = new Schema({
    roundId: { type: Schema.Types.ObjectId },
    status: { type: String, enum: Object.values(APPLICANT_ROUND_TYPES), default: APPLICANT_ROUND_TYPES.PENDING },
    jobId: { type: Schema.Types.ObjectId },
    applicantId: { type: Schema.Types.ObjectId },
    isSelected: { type: Boolean },
    lastQuestionId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const ApplicantRounds = mongoose.model<IApplicantRounds>('ApplicantRounds', ApplicantRoundsSchema);

export default ApplicantRounds;