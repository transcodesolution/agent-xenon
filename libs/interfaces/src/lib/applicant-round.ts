import { ITimestamp } from "./timestamp";

export enum InterviewRoundStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    ONGOING = "ongoing",
}

export interface IApplicantRounds extends ITimestamp {
    _id: string;
    roundId: string;
    status: InterviewRoundStatus;
    jobId: string;
    applicantId: string;
    isSelected: boolean;
}