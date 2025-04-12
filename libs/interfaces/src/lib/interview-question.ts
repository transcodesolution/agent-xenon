import { ITimestamp } from "./timestamp";
import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty } from "@agent-xenon/constants"

export interface IInterviewQuestion extends ITimestamp {
    _id: string;
    description: string;
    question: string;
    options: IMCQOptions[];
    tags: string[];
    difficulty: Difficulty;
    timeLimitInMinutes: number;
    evaluationCriteria: string;
    isMultiSelectOption: boolean;
    organizationId: string;
    questionFormat: AnswerQuestionFormat;
}

export interface IMCQOptions {
    index: AnswerMcqOptionFormat;
    text: string;
    isRightAnswer: boolean;
}