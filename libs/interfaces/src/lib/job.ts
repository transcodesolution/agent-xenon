import { ITimestamp } from "./timestamp";
import { IInterviewRound } from "./interview-round";
import { JobStatus } from "@agent-xenon/constants";
import { IJobRole } from "./job-role";
import { IDesignation } from "./designation";

export interface IJob<T = string> extends ITimestamp {
    _id: string;
    title: string;
    description: string;
    role: IJobRole;
    status: JobStatus;
    designation: IDesignation;
    qualificationCriteria: string;
    organizationId: string;
    name: string;
    rounds?: Array<Pick<IInterviewRound, "_id" | "type" | "endDate" | "startDate" | "qualificationCriteria" | "roundNumber" | "name">>;
    resumeUrls: string[];
}
