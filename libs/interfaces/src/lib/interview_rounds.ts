import { ITimestamp } from "./timestamp";

export interface IInterviewRounds extends Document, ITimestamp {
    _id: string;
    type: string | null;
    durationInSeconds: number | null;
    qualificationCriteria: string | null;
    jobId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    roundNumber: number | null;
}