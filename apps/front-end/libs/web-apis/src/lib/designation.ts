import http from "./http-common";
import { IApiResponse, IDesignation, PaginationApiResponseType } from "@agent-xenon/interfaces";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";
import { IGetDesignationRequest } from "@agent-xenon/types-api";

export const getDesignations = async (params: IGetDesignationRequest): Promise<IApiResponse<PaginationApiResponseType<IDesignation[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IDesignation[]>>>('/designation', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching designation: ${error}`);
  }
};

export const getDesignationById = async (designationId: string): Promise<IApiResponse<IDesignation>> => {
  try {
    const result = await http.get<IApiResponse<IDesignation>>(`/designation/${designationId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching designation by ID: ${error}`);
  }
};

export const createDesignation = async (params: Partial<IDesignation>): Promise<IApiResponse<IDesignation>> => {
  try {
    const result = await http.post<IApiResponse<IDesignation>>('/designation/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating designation");
  }
};

export const updateDesignation = async (params: Partial<IDesignation>): Promise<IApiResponse<IDesignation>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.put<IApiResponse<IDesignation>>(`/designation/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating designation");
  }
};

export const deleteDesignations = async (designationIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/designation', { data: { designationIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete designation: ${error}`);
  }
};