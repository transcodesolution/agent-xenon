import { IApiResponse, IUser } from '@agent-xenon/interfaces';
import http from './http-common'
import { IGetUserByIdRequest, IGetUserByIdResponse, IGetUserResponse, IGetUsersRequest, IGetUsersResponse, IUpdateUserResponse } from '@agent-xenon/types-api';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';

export const getUser = async (): Promise<IApiResponse<IGetUserResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserResponse>>('/user');
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching user: ${error}`);
  }
};

export const getUsers = async (params: IGetUsersRequest): Promise<IApiResponse<IGetUsersResponse>> => {
  const query = new URLSearchParams();
  query.set('search', params.search.toString());
  query.set('page', params.page.toString());
  query.set('limit', params.limit.toString());

  try {
    const result = await http.get<IApiResponse<IGetUsersResponse>>(`/user/all?${query}`);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "fetching user");
  }
};

export const getUserById = async (params: IGetUserByIdRequest): Promise<IApiResponse<IGetUserByIdResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserByIdResponse>>(`/user/${params.id}`);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "fetching user by id");
  }
};

export const updateUser = async (params: Partial<IUser>): Promise<IApiResponse<IUpdateUserResponse>> => {
  try {
    const { _id, ...otherParams } = params
    const result = await http.patch<IApiResponse<IUpdateUserResponse>>(`/user/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating user");
  }
};


export const createUser = async (params: Partial<IUser>): Promise<IApiResponse<IUser>> => {
  try {
    const result = await http.post<IApiResponse<IUser>>(`/user/add`, params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating user");
  }
};

export const deleteUsers = async (ids: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/user', { data: { ids } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete users: ${error}`);
  }
};