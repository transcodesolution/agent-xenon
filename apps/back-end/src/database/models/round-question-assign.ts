import { ITimestamp } from "@agent-xenon/interfaces";
import mongoose, { Schema } from "mongoose";

export interface IRoundQuestionAssign extends Document, ITimestamp {
    _id: string;
    questionId: string | null;
    jobId: string | null;
    roundId: string | null;
}

const RoundQuestionAssignSchema: Schema = new Schema({
    questionId: { type: Schema.Types.ObjectId },
    jobId: { type: Schema.Types.ObjectId },
    roundId: { type: Schema.Types.ObjectId },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false });

const RoundQuestionAssign = mongoose.model<IRoundQuestionAssign>('RoundQuestionAssign', RoundQuestionAssignSchema);

export default RoundQuestionAssign;