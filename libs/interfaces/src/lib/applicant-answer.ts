import { OverallResult } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";

export interface IQuestionAnswer {
    questionId: string;
    answer: string;
    overallResult: OverallResult;
}

export interface IApplicantAnswer extends ITimestamp {
    _id?: string;
    applicantId: string;
    answers: IQuestionAnswer[];
    roundId: string;
}