import { IApiResponse } from "@agent-xenon/interfaces";
import http from './http-common'
import { IConnectAppRequest, IConnectAppResponse, IDisConnectAppRequest, IGetAppsResponse } from "@/libs/types-api/src/lib/app";

export const getApps = async (): Promise<IApiResponse<IGetAppsResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetAppsResponse>>('/app');
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching apps: ${error}`);
  }
};

export const connectApp = async (params: IConnectAppRequest): Promise<IApiResponse<IConnectAppResponse>> => {
  try {
    const result = await http.post<IApiResponse<IConnectAppResponse>>('/app/connect', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while connecting apps: ${error}`);
  }
};

export const disconnectApp = async (params: IDisConnectAppRequest): Promise<IApiResponse<string>> => {
  try {
    const result = await http.post<IApiResponse<string>>('/app/disconnect', params);
    console.log(result.data, 'disconnect')
    return result.data;
  } catch (error) {
    throw new Error(`Error while disconnecting app: ${error}`);
  }
};