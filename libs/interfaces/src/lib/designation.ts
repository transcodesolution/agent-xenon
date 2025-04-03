import { ITimestamp } from "./timestamp";

export interface IDesignation extends ITimestamp {
    _id: string;
    name: string;
    description: string;
    organizationId: string;
}