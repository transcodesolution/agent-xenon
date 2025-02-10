import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IModule extends Document, ITimestamp {
    _id: string;
    tabName: string;
    displayName: string;
    tabUrl: string;
    image: string;
    parentId: string;
}