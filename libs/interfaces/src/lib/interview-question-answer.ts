import { ITimestamp } from "./timestamp";

export enum TechnicalQuestionAnswerTypes {
    MCQ = "mcq",
    DSA = "dsa",
    CODING = "coding",
    SYSTEM_DESIGN = "system_design",
    LOW_LEVEL_DESIGN = "low_level_design",
    OTHER = "other",
    BEHAVIORAL = "behavioral",
}

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

export enum AnswerInputFormat {
    TEXT = "text",
    MCQ = "mcq",
    FILE = "file",
    CODE = "code",
}

export interface IInterviewQuestionAnswer extends ITimestamp {
    _id: string;
    description: string;
    type: TechnicalQuestionAnswerTypes;
    question: string;
    promptText: string;
    answerDetails: {
        codeText: string;
        text: string;
    };
    options: {
        index: string;
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