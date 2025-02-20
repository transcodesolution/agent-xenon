import { InterviewRoundStatus } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";

export interface IApplicantRounds<T = string> extends ITimestamp {
    _id: string;
    roundIds: T[];
    status: InterviewRoundStatus;
    jobId: string;
    applicantId: T;
    isSelected: boolean;
}