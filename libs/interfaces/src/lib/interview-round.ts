import { ITimestamp } from "./timestamp";

export interface IInterviewRounds<T = string> extends ITimestamp {
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