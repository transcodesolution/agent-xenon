import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";
import { IRoundQuestionAssign } from "./round-question-assign";

export type questionAnswerType = Pick<IRoundQuestionAssign<IInterviewQuestionAnswer>, "questionId">;

export type submitExamType = questionAnswerType[];

export type submitExamAnswerPayloadType = Pick<IInterviewQuestionAnswer, "answerDetails">[];