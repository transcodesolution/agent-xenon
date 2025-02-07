import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IModule extends Document, ITimestamp {
    _id: string;
    tabName: string;
    displayName: string | null;
    tabUrl: string;
    image: string | null;
    parentId: string | null;
}