import { InterviewRoundStatus } from "@agent-xenon/constants";
import { IApplicantRound } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

const ApplicantRoundSchema: Schema = new Schema({
    roundIds: { type: [Schema.Types.ObjectId] },
    status: { type: String, enum: InterviewRoundStatus, default: InterviewRoundStatus.YET_TO_START },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    applicantId: { type: Schema.Types.ObjectId, ref: "Applicant" },
    isSelected: { type: Boolean },
    lastQuestionId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const ApplicantRound = mongoose.model<IApplicantRound>('ApplicantRounds', ApplicantRoundSchema);

export default ApplicantRound;