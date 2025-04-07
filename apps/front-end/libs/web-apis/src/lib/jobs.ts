import { IApiResponse, IInterviewRound, IJob, PaginationApiResponseType } from '@agent-xenon/interfaces';
import http from './http-common';
import { IGetJobRoleAndDesignation, IGetJobsParams, IInterviewRoundUpdateOrder, IUpdateInterviewRoundStatusRequest } from '@agent-xenon/types-api';

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

export const createInterviewRound = async (params: Partial<IInterviewRound>): Promise<IApiResponse<IInterviewRound>> => {
  try {
    const result = await http.post<IApiResponse<IInterviewRound>>('/interview-round/create', params);
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

export const getResumeUrls = async (jobId: string): Promise<IApiResponse<Pick<IJob, 'resumeUrls'>>> => {
  try {
    const result = await http.get<IApiResponse<Pick<IJob, 'resumeUrls'>>>(`/job/resume-url/${jobId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching resume URLs: ${error}`);
  }
};

export const addResumeUrl = async (params: { resumeUrls: string[], jobId: string }): Promise<IApiResponse<Pick<IJob, 'resumeUrls'>>> => {
  try {
    const result = await http.post<IApiResponse<Pick<IJob, 'resumeUrls'>>>('/job/resume-url/add', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while adding resume URLs: ${error}`);
  }
};
export const deleteResumeUrl = async (params: { resumeUrls: string, jobId: string }): Promise<IApiResponse<IJob>> => {
  try {
    const result = await http.delete<IApiResponse<IJob>>(`/job/resume-url/${params.jobId}?resumeUrl=${params.resumeUrls}`,);
    return result.data;
  } catch (error) {
    throw new Error(`Error while deleting resume URL: ${error}`);
  }
};

export const getInterviewRoundsById = async (roundId: string): Promise<IApiResponse<IInterviewRound>> => {
  try {
    const result = await http.get<IApiResponse<IInterviewRound>>(`/interview-round/${roundId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching round by ID: ${error}`);
  }
};

export const updateInterviewRound = async (params: Partial<IInterviewRound>): Promise<IApiResponse<IInterviewRound>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.patch<IApiResponse<IInterviewRound>>(`/interview-round/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    throw new Error(`Error while updating interviewRound: ${error}`);
  }
};

export const getInterviewRoundsByJobId = async (jobId: string): Promise<IApiResponse<IInterviewRound[]>> => {
  try {
    const result = await http.get<IApiResponse<IInterviewRound[]>>(`/interview-round/by-job/${jobId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching round by Job ID: ${error}`);
  }
};

export const interviewRoundStart = async (params: { jobId: string, roundId: string }): Promise<IApiResponse<IInterviewRound>> => {
  try {
    const result = await http.post<IApiResponse<IInterviewRound>>(`/interview-round/start`, params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while start round: ${error}`);
  }
};


export const updateRoundStatus = async (params: IUpdateInterviewRoundStatusRequest): Promise<IApiResponse> => {
  try {
    const { roundId, ...otherParams } = params;
    const result = await http.patch<IApiResponse>(`/interview-round/status/${roundId}`, otherParams);
    return result.data;
  } catch (error) {
    throw new Error(`Error while updating interviewRound: ${error}`);
  }
};

export const updateInterviewRoundOrder = async (params: IInterviewRoundUpdateOrder): Promise<IApiResponse<IInterviewRound>> => {
  try {
    const result = await http.patch<IApiResponse<IInterviewRound>>(`/interview-round/order-update`, params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while updating order: ${error}`);
  }
};