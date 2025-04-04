import { IOrganization } from "./organization";
import { IRole } from "./role";
import { ITimestamp } from "./timestamp";

export interface IUser<T = string, U = string> extends ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: U;
    organization: IOrganization;
    roleId: T;
    role: IRole;
}