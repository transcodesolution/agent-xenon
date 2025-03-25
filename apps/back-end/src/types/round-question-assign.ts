import { ITimestamp } from "@agent-xenon/interfaces";
import { Document } from "mongoose";

export interface IRoundQuestionAssign<T = string> extends Document, ITimestamp {
    _id: string;
    questionId: T;
    jobId: string;
    roundId: string;
}