import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IJob extends Document, ITimestamp {
    _id: string;
    title: string | null;
    description: string | null;
    role: string | null;
    status: string | null;
    designation: string | null;
    qualificationCriteria: string | null;
    organizationId: string | null;
}