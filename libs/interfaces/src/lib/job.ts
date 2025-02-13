import { ITimestamp } from "./timestamp";
import { IInterviewRounds } from "./interview-round";
import { JobStatus } from "@agent-xenon/constants";

export interface IJob extends ITimestamp {
    _id: string;
    title: string;
    description: string;
    role: string;
    status: JobStatus;
    designation: string;
    qualificationCriteria: string;
    organizationId: string;
    rounds?: Array<Pick<IInterviewRounds, "_id" | "type" | "durationInSeconds" | "qualificationCriteria" | "roundNumber">>;
}