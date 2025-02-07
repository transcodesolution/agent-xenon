import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IJobRole extends Document, ITimestamp {
    _id: string;
    name: string | null;
    organizationId: string | null;
}