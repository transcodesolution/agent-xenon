import { IApiResponse, IInterviewRounds, IJob, PaginationApiResponseType } from '@agent-xenon/interfaces';
import http from './http-common';
import { IGetJobRoleAndDesignation, IGetJobsParams } from '@agent-xenon/types-api';

export const getJobs = async (params: IGetJobsParams): Promise<IApiResponse<PaginationApiResponseType<IJob[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IJob[]>>>('/job', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching jobs: ${error}`);
  }
};

export const createJob = async (params: Partial<IJob>): Promise<IApiResponse<IJob>> => {
  try {
    const result = await http.post<IApiResponse<IJob>>('/job/create', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while creating job: ${error}`);
  }
};

export const getJobById = async (jobId: string): Promise<IApiResponse<IJob>> => {
  try {
    const result = await http.get<IApiResponse<IJob>>(`/job/${jobId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching job by ID: ${error}`);
  }
};

export const updateJob = async (params: Partial<IJob>): Promise<IApiResponse<IJob>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.patch<IApiResponse<IJob>>(`/job/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    throw new Error(`Error while updating job: ${error}`);
  }
};

export const deleteJobs = async (jobIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/job', { data: { jobIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete job: ${error}`);
  }
};

export const getJobRoleAndDesignation = async (): Promise<IApiResponse<IGetJobRoleAndDesignation>> => {
  try {
    const result = await http.get<IApiResponse<IGetJobRoleAndDesignation>>('/job/job-role-and-designation');
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching role and designation: ${error}`);
  }
};

export const createInterviewRound = async (params: Partial<IInterviewRounds>): Promise<IApiResponse<IInterviewRounds>> => {
  try {
    const result = await http.post<IApiResponse<IInterviewRounds>>('/interview-round/create', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while creating interview round: ${error}`);
  }
};

export const deleteInterviewRounds = async (roundIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/interview-round', { data: { roundIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while deleting interview rounds: ${error}`);
  }
};