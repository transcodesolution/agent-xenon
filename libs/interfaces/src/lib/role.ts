import { RoleTypes } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";

export interface IRole extends ITimestamp {
    _id: string;
    name: RoleTypes;
    isAdministratorRole: boolean;
}