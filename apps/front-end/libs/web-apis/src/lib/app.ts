import { IApiResponse, IApplicant, PaginationApiResponseType } from "@agent-xenon/interfaces";
import http from './http-common'

export const getApps = async (): Promise<IApiResponse<PaginationApiResponseType<IApplicant[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IApplicant[]>>>('/applicant');
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching apps: ${error}`);
  }
};

export const connectApp = async (_id: string): Promise<IApiResponse<string>> => {
  try {
    const result = await http.get<IApiResponse<string>>('/applicant');
    return result.data;
  } catch (error) {
    throw new Error(`Error while connecting apps: ${error}`);
  }
};

export const disconnectApp = async (_id: string): Promise<IApiResponse<string>> => {
  try {
    const result = await http.get<IApiResponse<string>>('/applicant');
    return result.data;
  } catch (error) {
    throw new Error(`Error while disconnecting app: ${error}`);
  }
};