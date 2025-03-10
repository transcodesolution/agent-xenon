import { IApiResponse, IRole, IUser } from '@agent-xenon/interfaces';
import http from './http-common'
import { IGetUserResponse } from '@agent-xenon/types-api';

export const getUser = async (): Promise<IApiResponse<IGetUserResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserResponse>>('/user');
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching user: ${error}`);
  }
};

export const updateUser = async (params: Partial<IUser<IRole>>): Promise<IApiResponse<IGetUserResponse>> => {
  try {
    const { _id, ...otherParams } = params
    const result = await http.patch<IApiResponse<IGetUserResponse>>(`/user/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    throw new Error(`Error while updating user: ${error}`);
  }
};

