import { ITimestamp } from "./timestamp";
import { IInterviewRounds } from "./interview_rounds";

export enum JobStatus {
    OPEN = "open",
    CLOSE = "close",
    PAUSED = "paused",
    INTERVIEW_STARTED = "interview_started",
}

export interface IJob extends ITimestamp {
    _id: string;
    title: string;
    description: string;
    role: string;
    status: JobStatus;
    designation: string;
    qualificationCriteria: string;
    organizationId: string;
    rounds?: Array<Pick<IInterviewRounds, "_id" | "type" | "durationInSeconds" | "qualificationCriteria" | "roundNumber">>;
}