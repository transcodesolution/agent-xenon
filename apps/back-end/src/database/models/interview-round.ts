import { InterviewRoundStatus, InterviewRoundTypes } from "@agent-xenon/constants";
import { IInterviewRound } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

const InterviewRoundSchema: Schema = new Schema({
    type: { type: String, enum: InterviewRoundTypes },
    name: { type: String },
    interviewerEmail: { type: String },
    qualificationCriteria: { type: String },
    selectionMarginInPercentage: { type: Number },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    startDate: { type: Date },
    endDate: { type: Date, default: Date.now() + 172800 * 1000 },
    roundNumber: { type: Number },
    status: { type: String, enum: InterviewRoundStatus, default: InterviewRoundStatus.YET_TO_START },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

const InterviewRound = mongoose.model<IInterviewRound>('InterviewRounds', InterviewRoundSchema);

export default InterviewRound;