import { ITimestamp } from "./timestamp";
import { IInterviewRounds } from "./interview-round";
import { JobStatus } from "@agent-xenon/constants";

export interface IJob<T = string> extends ITimestamp {
    _id: string;
    title: string;
    description: string;
    role: T;
    status: JobStatus;
    designation: T;
    qualificationCriteria: string;
    organizationId: string;
    rounds?: Array<Pick<IInterviewRounds, "_id" | "type" | "durationInSeconds" | "qualificationCriteria" | "roundNumber">>;
}

export interface IGetJobsParams {
    page: number;
    limit: number;
    search: string;
    role?: string;
    designation?: string;
};