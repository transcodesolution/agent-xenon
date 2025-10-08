import { InterviewRoundTypes } from "@agent-xenon/constants";

export interface IMailTemplate {
    roundType?: InterviewRoundTypes;
    roundName?: string;
    updatedOn?: string;
    frontendDomailUrl?: string;
    applicantEmail?: string;
    applicantPassword?: string;
    employeeEmail?: string;
    employeePassword?: string;
    examLink?: string;
}