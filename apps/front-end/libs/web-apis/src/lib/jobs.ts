import http from './http-common';
import { IGetJobsParams, IGetJobsResponse } from '@agent-xenon/types-api';

export const getJobs = async (params: IGetJobsParams): Promise<IGetJobsResponse> => {
  try {
    const result = await http.get<IGetJobsResponse>('/job', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching jobs: ${error}`);
  }
};