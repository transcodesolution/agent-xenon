import http from "./http-common";
import { IApiResponse, IRole, PaginationApiResponseType } from "@agent-xenon/interfaces";
import { IGetRolesRequest } from "@/libs/types-api/src/lib/role";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";

export const getRoles = async (params: IGetRolesRequest): Promise<IApiResponse<PaginationApiResponseType<IRole[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IRole[]>>>('/role', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching roles: ${error}`);
  }
};

export const getRoleById = async (roleId: string): Promise<IApiResponse<IRole>> => {
  try {
    const result = await http.get<IApiResponse<IRole>>(`/role/${roleId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching role by ID: ${error}`);
  }
};

export const createRole = async (params: Partial<IRole>): Promise<IApiResponse<IRole>> => {
  try {
    const result = await http.post<IApiResponse<IRole>>('/role/add', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating role");
  }
};

export const updateRole = async (params: Partial<IRole>): Promise<IApiResponse<IRole>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.patch<IApiResponse<IRole>>(`/role/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating role");
  }
};

export const deleteRoles = async (roleIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/role', { data: { roleIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete role: ${error}`);
  }
};