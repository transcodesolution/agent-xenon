import { InterviewRoundTypes } from "@agent-xenon/constants";

export interface IMailTemplate {
    roundType?: InterviewRoundTypes;
    roundName?: string;
    updatedOn?: string;
    frontendDomailUrl?: string;
    applicantEmail?: string;
    applicantPassword?: string;
    examLink?: string;
}