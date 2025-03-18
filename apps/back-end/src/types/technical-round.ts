import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { IRoundQuestionAssign } from "./round-question-assign";
import { OverallResult } from "../utils/enum";

export type questionAnswerType = Pick<IRoundQuestionAssign<IInterviewQuestionAnswer>, "questionId">;

export type submitExamType = questionAnswerType;

export type submitExamAnswerPayloadType = { answer: string, questionId: string };

export interface ICandidateAnswerAnalysisResponse {
    overallStatus: OverallResult;
}