import { ITimestamp } from "./timestamp";

export interface IUser<T = string, U = string> extends ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: U;
    roleId: T;
}