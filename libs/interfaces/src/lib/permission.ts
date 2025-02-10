import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IPermission extends Document, ITimestamp {
    _id: string;
    moduleId: string;
    roleId: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}