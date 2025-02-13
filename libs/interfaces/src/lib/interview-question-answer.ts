import { ITimestamp } from "./timestamp";
import { AnswerInputFormat, AnswerMcqOptionFormat, Difficulty, TechnicalRoundTypes } from "@agent-xenon/constants"

export interface IInterviewQuestionAnswer extends ITimestamp {
    _id: string;
    description: string;
    type: TechnicalRoundTypes;
    question: string;
    promptText: string;
    answerDetails: {
        codeText: string;
        text: string;
    };
    options: {
        index: AnswerMcqOptionFormat;
        text: string;
    }[];
    tags: string[];
    difficulty: Difficulty;
    timeLimitInMinutes: number;
    evaluationCriteria: string;
    isAutomated: boolean;
    organizationId: string;
    inputFormat: AnswerInputFormat;
}