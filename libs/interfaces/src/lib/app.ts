import { App } from "@agent-xenon/constants";
import { ITimestamp } from "./timestamp";

export interface IApp extends ITimestamp {
    _id: string;
    name: App;
    isAppConnect: boolean;
}