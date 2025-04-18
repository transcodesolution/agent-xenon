import { ExamStatus } from "@agent-xenon/constants";
import { IInterviewQuestion } from "@agent-xenon/interfaces";

export interface IGetInterviewMCQQuestionsRequest {
  roundId: string;
}

export interface IGetInterviewMCQQuestionsResponse {
  questions: IInterviewQuestion[]
  roundId: string;
  status?: ExamStatus
  roundName?: string
}

export interface ISubmitInterviewQuestionsRequest {
  roundId: string;
  questionAnswers: IExamQuestionAnswer[]
}

export interface IExamQuestionAnswer {
  questionId: string;
  answer: string | string[];
}
export interface ISubmitInterviewQuestionsResponse {
  status: ExamStatus
}

export interface IGetQuestionsRequest {
  page: number;
  limit: number;
  search: string;
}

export interface ICodeExecuteRequest {
  code: string;
  language: string;
  version: string
}

export interface ICodeExecuteResponse {
  code: number;
  output: string;
  signal: string;
  stderr: string;
  stdout: string;
}