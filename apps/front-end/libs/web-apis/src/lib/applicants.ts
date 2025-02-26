import { IApiResponse, IApplicant, PaginationApiResponseType } from "@agent-xenon/interfaces";
import http from './http-common'
import { IGetApplicantsRequest } from "@agent-xenon/types-api";

export const getApplicants = async (params: IGetApplicantsRequest): Promise<IApiResponse<PaginationApiResponseType<IApplicant[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IApplicant[]>>>('/applicant', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching applicants: ${error}`);
  }
};


export const deleteApplicants = async (applicantIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/applicant', { data: { applicantIds } });
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
    throw new Error(`Error while creating applicant: ${error}`);
  }
};

export const createJobApplicantByAgent = async (params: { jobId: string }): Promise<IApiResponse<IApplicant>> => {
  try {
    const result = await http.post<IApiResponse<IApplicant>>('/applicant/createByAgent', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while creating applicant: ${error}`);
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
    throw new Error(`Error while updating applicant: ${error}`);
  }
};
