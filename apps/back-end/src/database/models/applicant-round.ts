import { InterviewRoundStatus } from "@agent-xenon/constants";
import { IApplicantRounds } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

const ApplicantRoundsSchema: Schema = new Schema({
    roundId: { type: Schema.Types.ObjectId },
    status: { type: String, enum: InterviewRoundStatus, default: InterviewRoundStatus.PENDING },
    jobId: { type: Schema.Types.ObjectId },
    applicantId: { type: Schema.Types.ObjectId },
    isSelected: { type: Boolean },
    lastQuestionId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const ApplicantRounds = mongoose.model<IApplicantRounds>('ApplicantRounds', ApplicantRoundsSchema);

export default ApplicantRounds;