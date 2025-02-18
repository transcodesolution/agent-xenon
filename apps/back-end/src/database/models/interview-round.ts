import { InterviewRoundStatus, InterviewRoundTypes, TechnicalRoundTypes } from "@agent-xenon/constants";
import { IInterviewRounds } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

const InterviewRoundsSchema: Schema = new Schema({
    type: { type: String, enum: InterviewRoundTypes },
    subType: { type: String, enum: TechnicalRoundTypes },
    durationInSeconds: { type: Number, default: 172800 },
    qualificationCriteria: { type: String },
    mcqCriteria: { type: Number },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    startDate: { type: Date },
    endDate: { type: Date },
    roundNumber: { type: Number },
    status: { type: String, enum: InterviewRoundStatus, default: InterviewRoundStatus.YET_TO_START },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });


const InterviewRounds = mongoose.model<IInterviewRounds>('InterviewRounds', InterviewRoundsSchema);

export default InterviewRounds;