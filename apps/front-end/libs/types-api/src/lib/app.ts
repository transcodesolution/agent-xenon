import { IApp } from "@agent-xenon/interfaces";

export interface IGetAppsResponse {
  appData: IApp[]
}

export interface IConnectAppRequest {
  appId: string;
}

export interface IConnectAppResponse {
  redirectUrl: string;
}

export interface IDisConnectAppRequest {
  appId: string;
}

export interface IDisConnectAppResponse {
  redirectUrl: string;
}