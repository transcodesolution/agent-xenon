import { ITimestamp } from "./timestamp";

export interface IUser<T = string> extends ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: string;
    roleId: T;
}