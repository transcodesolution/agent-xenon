import { IInterviewQuestion } from "@agent-xenon/interfaces";
import { IRoundQuestionAssign } from "./round-question-assign";
import { OverallResult } from "@agent-xenon/constants";

export type questionAnswerType = Pick<IRoundQuestionAssign<IInterviewQuestion>, "questionId">;

export type submitExamType = questionAnswerType;

export type submitExamAnswerPayloadType = { answer: string, questionId: string, overallResult: OverallResult };

export interface ICandidateAnswerAnalysisResponse {
    overallStatus: OverallResult;
}