import axiosInstance from "./http-common";
import { IApiResponse, IRole, PaginationApiResponseType } from "@agent-xenon/interfaces";
import { IGetRolesRequest } from "@/libs/types-api/src/lib/role";

export const getRoles = async (params: IGetRolesRequest): Promise<IApiResponse<PaginationApiResponseType<IRole[]>>> => {
  try {
    const result = await axiosInstance.get<IApiResponse<PaginationApiResponseType<IRole[]>>>('/role', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching roles: ${error}`);
  }
};