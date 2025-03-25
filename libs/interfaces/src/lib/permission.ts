import { ITimestamp } from "./timestamp";

export interface IPermission extends ITimestamp {
    _id: string;
    moduleId: string;
    roleId: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}