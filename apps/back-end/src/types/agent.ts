import { IApplicant } from "@agent-xenon/interfaces"

export interface IResumeExtractResponse {
    type: string;
    message: IApplicant[];
}