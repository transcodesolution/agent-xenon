import http from "./http-common";
import { IApiResponse, IJobRole, PaginationApiResponseType } from "@agent-xenon/interfaces";
import { IGetRolesRequest } from "@/libs/types-api/src/lib/role";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";

export const getJobRoles = async (params: IGetRolesRequest): Promise<IApiResponse<PaginationApiResponseType<IJobRole[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IJobRole[]>>>('/jobRole', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching job roles: ${error}`);
  }
};

export const getJobRoleById = async (roleId: string): Promise<IApiResponse<IJobRole>> => {
  try {
    const result = await http.get<IApiResponse<IJobRole>>(`/jobRole/${roleId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching job role by ID: ${error}`);
  }
};

export const createJobRole = async (params: Partial<IJobRole>): Promise<IApiResponse<IJobRole>> => {
  try {
    const result = await http.post<IApiResponse<IJobRole>>('/jobRole/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating job role");
  }
};

export const updateJobRole = async (params: Partial<IJobRole>): Promise<IApiResponse<IJobRole>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.put<IApiResponse<IJobRole>>(`/jobRole/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating job role");
  }
};

export const deleteJobRoles = async (jobRoleIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/jobRole', { data: { jobRoleIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete job role: ${error}`);
  }
};