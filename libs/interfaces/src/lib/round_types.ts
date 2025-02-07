import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IRound_type extends Document, ITimestamp {
    _id: string;
    name: string | null;
    organizationId: string | null;
}