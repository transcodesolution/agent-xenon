import { ITimestamp } from "./timestamp";

export enum RoleTypes {
    USER = "user",
    ADMIN = "admin",
    ADMINISTRATOR = "administrator",
}

export interface IRole extends ITimestamp {
    _id: string;
    name: RoleTypes;
    isAdministratorRole: boolean;
}