import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IInterviewRounds extends Document, ITimestamp {
    _id: string;
    type: string;
    durationInSeconds: number;
    qualificationCriteria: string;
    jobId: string;
    startDate: Date;
    endDate: Date;
    roundNumber: number;
}