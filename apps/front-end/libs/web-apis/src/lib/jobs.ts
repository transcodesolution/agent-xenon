import { IJob } from '@agent-xenon/interfaces';
import http from './http-common';
import { ICreateJobParams, IGetJobsParams, IGetJobsResponse } from '@agent-xenon/types-api';

export const getJobs = async (params: IGetJobsParams): Promise<IGetJobsResponse> => {
  try {
    const result = await http.get<IGetJobsResponse>('/job', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching jobs: ${error}`);
  }
};

export const createJob = async (params: ICreateJobParams): Promise<IJob> => {
  try {
    const result = await http.post<IJob>('/job/create', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while creating job:' ${error}`);
  }
};
