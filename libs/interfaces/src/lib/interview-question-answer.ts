import { ITimestamp } from "./timestamp";
import { AnswerInputFormat, AnswerMcqOptionFormat, Difficulty, InterviewRoundTypes, TechnicalRoundType } from "@agent-xenon/constants"

export interface IInterviewQuestionAnswer extends ITimestamp {
    _id: string;
    description: string;
    type: InterviewRoundTypes;
    subType: TechnicalRoundType;
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