import { IApiResponse, IApplicant, IApplicantApiResponseState, IApplicantInterviewRoundDetail, IApplicantInterviewRounds, IJob, PaginationApiResponseType } from "@agent-xenon/interfaces";
import http from './http-common'
import { IDeleteApplicantsRequest, IGetApplicantsRequest } from "@agent-xenon/types-api";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";

export const getApplicants = async (params: IGetApplicantsRequest): Promise<IApiResponse<PaginationApiResponseType<IApplicant[], IApplicantApiResponseState>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IApplicant[], IApplicantApiResponseState>>>('/applicant', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching applicants: ${error}`);
  }
};

export const deleteApplicants = async (params: IDeleteApplicantsRequest): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/applicant', { data: params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete applicants: ${error}`);
  }
};

export const createJobApplicant = async (params: Partial<IApplicant>): Promise<IApiResponse<IApplicant>> => {
  try {
    const result = await http.post<IApiResponse<IApplicant>>('/applicant/createByUser', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating applicant");
  }
};

export const createJobApplicantByAgent = async (params: { jobId: string }): Promise<IApiResponse<IApplicant>> => {
  try {
    const result = await http.post<IApiResponse<IApplicant>>('/applicant/createByAgent', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating applicant");
  }
};

export const getApplicantById = async (applicantId: string): Promise<IApiResponse<IApplicant>> => {
  try {
    const result = await http.get<IApiResponse<IApplicant>>(`/applicant/${applicantId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching applicant by ID: ${error}`);
  }
};

export const updateJobApplicant = async (params: Partial<IApplicant>): Promise<IApiResponse<IApplicant>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.put<IApiResponse<IApplicant>>(`/applicant/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating applicant");
  }
};


export const getApplicantInterviewRounds = async ({ jobId, applicantId }: { jobId: string; applicantId: string }): Promise<IApiResponse<IApplicantInterviewRounds>> => {
  try {
    const result = await http.get<IApiResponse<IApplicantInterviewRounds>>(`applicant/interview-detail/${applicantId}/job/${jobId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching applicant interview rounds: ${error}`);
  }
};


export const getApplicantInterviewRoundDetails = async ({ roundId, applicantId }: { roundId: string; applicantId: string }): Promise<IApiResponse<IApplicantInterviewRoundDetail>> => {
  try {
    const result = await http.get<IApiResponse<IApplicantInterviewRoundDetail>>(`/interview-round/${roundId}/applicant/${applicantId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching interview round details: ${error}`);
  }
};

export const getAppliedJobsByApplicantId = async (applicantId: string): Promise<IApiResponse<IJob[]>> => {
  try {
    const result = await http.get<IApiResponse<IJob[]>>(`/applicant/applied-job/${applicantId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching applied jobs applicant by ID: ${error}`);
  }
};