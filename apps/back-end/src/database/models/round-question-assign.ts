import mongoose, { Schema } from "mongoose";
import { IRoundQuestionAssign } from "../../types/round-question-assign";

const RoundQuestionAssignSchema: Schema = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: "InterviewQuestionAnswer" },
    jobId: { type: Schema.Types.ObjectId },
    roundId: { type: Schema.Types.ObjectId, ref: "InterviewRounds" },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const RoundQuestionAssign = mongoose.model<IRoundQuestionAssign>('RoundQuestionAssign', RoundQuestionAssignSchema);

export default RoundQuestionAssign;