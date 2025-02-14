import { IApplicant } from "@agent-xenon/interfaces"

export interface IResumeExtractResponse {
    type: string;
    message: IApplicant[];
}

export interface IScreeningResponse {
    type: string;
    message: string[];
}