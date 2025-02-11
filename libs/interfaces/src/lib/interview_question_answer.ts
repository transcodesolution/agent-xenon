import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IInterviewQuestionAnswer extends Document, ITimestamp {
    _id: string;
    description: string;
    type: string;
    question: string;
    promptText: string;
    answerDetails: {
        codeText: string | null;
        text: string | null;
    };
    options: {
        index: string | null;
        text: string | null;
    }[];
    tags: string[];
    difficulty: string;
    timeLimitInMinutes: number;
    evaluationCriteria: string;
    isAutomated: boolean;
    organizationId: string;
    inputFormat: string;
}