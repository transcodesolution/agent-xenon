import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IRole extends Document, ITimestamp {
    _id: string;
    name: string;
    isAdministratorRole: boolean;
}