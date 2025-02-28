import { Permission, RoleTypes } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";

export interface IRole extends ITimestamp {
    _id: string;
    name: string;
    organizationId: string;
    type: RoleTypes;
    permissions: Permission[];
}