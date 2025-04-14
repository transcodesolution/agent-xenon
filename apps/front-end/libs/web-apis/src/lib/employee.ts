import http from "./http-common";
import { IApiResponse, IEmployee, PaginationApiResponseType } from "@agent-xenon/interfaces";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";
import { IGetEmployeeRequest } from "@agent-xenon/types-api";

export const getEmployees = async (params: IGetEmployeeRequest): Promise<IApiResponse<PaginationApiResponseType<IEmployee[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IEmployee[]>>>('employee', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching employee: ${error}`);
  }
};

export const getEmployeeById = async (employeeId: string): Promise<IApiResponse<IEmployee>> => {
  try {
    const result = await http.get<IApiResponse<IEmployee>>(`employee/${employeeId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching employee by ID: ${error}`);
  }
};

export const createEmployee = async (params: Partial<IEmployee>): Promise<IApiResponse<IEmployee>> => {
  try {
    const result = await http.post<IApiResponse<IEmployee>>('employee/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating employee");
  }
};

export const updateEmployee = async (params: Partial<IEmployee>): Promise<IApiResponse<IEmployee>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.patch<IApiResponse<IEmployee>>(`employee/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating employee");
  }
};

export const deleteEmployees = async (employeeIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('employee', { data: { employeeIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete employee: ${error}`);
  }
};