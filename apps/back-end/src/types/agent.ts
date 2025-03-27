import { IApplicant } from "@agent-xenon/interfaces"

export interface IAgentResponse {
    applicantId: string;
    isSelected: boolean;
}

export interface IResumeExtractResponse {
    type: string;
    message: IApplicant[];
}

export interface IScreeningResponse {
    type: string;
    applicants: IAgentResponse[];
}