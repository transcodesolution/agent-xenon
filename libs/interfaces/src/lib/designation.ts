import { ITimestamp } from "./timestamp";

export interface IDesignation extends Document, ITimestamp {
    _id: string;
    name: string | null;
    organizationId: string | null;
}