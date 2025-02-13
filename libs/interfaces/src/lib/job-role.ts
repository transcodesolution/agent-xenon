import { ITimestamp } from "./timestamp";

export interface IJobRole extends ITimestamp {
    _id: string;
    name: string;
    organizationId: string;
}