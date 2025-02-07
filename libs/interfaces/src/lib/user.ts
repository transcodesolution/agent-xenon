import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IUser extends Document, ITimestamp {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: string;
    roleId: string | null;
}