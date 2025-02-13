import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";
import { IJob } from "./job";

export interface IInterviewRounds<T = string> extends Document, ITimestamp {
    _id: string;
    type: string;
    durationInSeconds: number;
    qualificationCriteria: string;
    mcqCriteria: number;
    jobId: T;
    startDate: Date;
    endDate: Date;
    roundNumber: number;
}