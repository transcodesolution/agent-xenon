import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IDesignation extends Document, ITimestamp {
    _id: string;
    name: string;
    organizationId: string;
}