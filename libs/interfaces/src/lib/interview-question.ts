import { ITimestamp } from "./timestamp";
import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty, InterviewRoundTypes } from "@agent-xenon/constants"

export interface IInterviewQuestionAnswer extends ITimestamp {
    _id: string;
    description: string;
    type: InterviewRoundTypes;
    question: string;
    options: {
        index: AnswerMcqOptionFormat;
        text: string;
        isRightAnswer: boolean;
    }[];
    tags: string[];
    difficulty: Difficulty;
    timeLimitInMinutes: number;
    evaluationCriteria: string;
    isMultiSelectOption: boolean;
    organizationId: string;
    questionFormat: AnswerQuestionFormat;
}