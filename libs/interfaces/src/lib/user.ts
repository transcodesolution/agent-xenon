import { ITimestamp } from "./timestamp";
import { IRole } from "./role";

export interface IUser extends ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: string;
    roleId: string | IRole;
}