import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IInterviewQuestionAnswer extends Document, ITimestamp {
    _id: string;
    description: string | null;
    type: string | null;
    question: string | null;
    text: string | null;
    answerDetails: {
        codeText: string | null;
        options: string[] | null;
        text: string | null;
    };
    options: string[] | null;
    tags: string[] | null;
    difficulty: string | null;
    timeLimitInMinutes: number | null;
    evaluationCriteria: string | null;
    isAutomated: boolean | null;
    organizationId: string | null;
    inputFormat: string | null;
}