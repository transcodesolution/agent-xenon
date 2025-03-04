import { InterviewRoundStatus, InterviewRoundTypes, TechnicalRoundType } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";
import { IApplicant } from "./applicant";
import { Document } from "mongoose";

export interface IApplicantRoundList {
    _id: string;
    status: InterviewRoundStatus;
    isSelected: boolean;
    applicantId: IApplicant
}

export interface IInterviewRound<T = string> extends Partial<Document>, ITimestamp {
    _id: string;
    type: InterviewRoundTypes;
    subType: TechnicalRoundType;
    name: string;
    qualificationCriteria: string;
    mcqCriteria: number;
    jobId: T;
    startDate: Date;
    endDate: Date;
    roundNumber: number;
    status: InterviewRoundStatus;
    _doc: IInterviewRound<T>;
    previousRound?: Partial<IInterviewRound<T>>;
    questions?: T[]
    applicants?: IApplicantRoundList[]
    expiredDate: Date;
}