import { IInterviewRounds } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

const InterviewRoundsSchema: Schema = new Schema({
    type: { type: Schema.Types.ObjectId, ref: "Round_type" },
    durationInSeconds: { type: Number },
    qualificationCriteria: { type: String },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    startDate: { type: Date },
    endDate: { type: Date },
    roundNumber: { type: Number },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

const InterviewRounds = mongoose.model<IInterviewRounds>('InterviewRounds', InterviewRoundsSchema);

export default InterviewRounds;