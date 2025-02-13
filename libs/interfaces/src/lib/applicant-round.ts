import { InterviewRoundStatus } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";



export interface IApplicantRounds extends ITimestamp {
    _id: string;
    roundId: string;
    status: InterviewRoundStatus;
    jobId: string;
    applicantId: string;
    isSelected: boolean;
}