import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";
import { IInterviewRounds } from "./interview_rounds";

export interface IJob extends Document, ITimestamp {
    _id: string;
    title: string;
    description: string;
    role: string;
    status: string;
    designation: string;
    qualificationCriteria: string;
    organizationId: string;
    rounds?: Array<Pick<IInterviewRounds, "_id" | "type" | "durationInSeconds" | "qualificationCriteria" | "roundNumber">>;
}