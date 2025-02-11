import { ITimestamp } from "@agent-xenon/interfaces";
import { Document } from "mongoose";

export interface IRoundQuestionAssign extends Document, ITimestamp {
    _id: string;
    questionId: string | null;
    jobId: string | null;
    roundId: string | null;
}