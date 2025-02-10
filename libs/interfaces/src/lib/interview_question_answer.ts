import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IInterviewQuestionAnswer extends Document, ITimestamp {
    _id: string;
    description: string;
    type: string;
    question: string;
    text: string;
    answerDetails: {
        codeText: string;
        options: string[];
        text: string;
    };
    options: string[];
    tags: string[];
    difficulty: string;
    timeLimitInMinutes: number;
    evaluationCriteria: string;
    isAutomated: boolean;
    organizationId: string;
    inputFormat: string;
}