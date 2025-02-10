import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IJob extends Document, ITimestamp {
    _id: string;
    title: string;
    description: string;
    role: string;
    status: string;
    designation: string;
    qualificationCriteria: string;
    organizationId: string;
}