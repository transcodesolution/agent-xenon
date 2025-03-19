import { ITimestamp } from "./timestamp";
import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty, InterviewRoundTypes } from "@agent-xenon/constants"

export interface IInterviewQuestionAnswer extends ITimestamp {
    _id: string;
    description: string;
    type: InterviewRoundTypes;
    question: string;
    options: IMCQOptions[];
    tags: string[];
    difficulty: Difficulty;
    timeLimitInMinutes: number;
    evaluationCriteria: string;
    isAutomated: boolean;
    organizationId: string;
    questionFormat: AnswerQuestionFormat;
}

export interface IMCQOptions {
    index: AnswerMcqOptionFormat;
    text: string;
    isRightAnswer: boolean;
}