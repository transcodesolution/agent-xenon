import { InterviewRoundStatus, InterviewRoundTypes, TechnicalRoundTypes } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";
import { IApplicant } from "./applicant";
import { Document } from "mongoose";

export interface IInterviewRounds<T = string> extends Partial<Document>, ITimestamp {
    _id: string;
    type: InterviewRoundTypes;
    subType: TechnicalRoundTypes;
    durationInSeconds: number;
    name: string;
    qualificationCriteria: string;
    mcqCriteria: number;
    jobId: T;
    startDate: Date;
    endDate: Date;
    roundNumber: number;
    status: InterviewRoundStatus;
    _doc: IInterviewRounds<T>;
    previousRound?: Partial<IInterviewRounds<T>>;
    questions?: T[]
    applicants?: {
        _id: string;
        status: InterviewRoundStatus;
        isSelected: boolean;
        applicantId: IApplicant
    }[]
}