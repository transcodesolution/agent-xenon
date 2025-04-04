import { ITimestamp } from "./timestamp";
import { IInterviewRound } from "./interview-round";
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
    name: string;
    rounds?: Array<Pick<IInterviewRound, "_id" | "type" | "endDate" | "startDate" | "qualificationCriteria" | "roundNumber" | "name">>;
    resumeUrls: string[];
}
