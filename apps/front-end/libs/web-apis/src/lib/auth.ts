import { ISignInRequest, ISignInResponse } from "@/libs/types-api/src";
import axiosInstance, { axiosNextServerInstance } from "./http-common";

export const signIn = async (params: ISignInRequest): Promise<ISignInResponse> => {
  try {
    const result = await axiosInstance.post<ISignInResponse>('/auth/login', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while signin: ${error}`);
  }
};

export const nextServerSignIn = async (params: ISignInRequest): Promise<ISignInResponse> => {
  try {
    const result = await axiosNextServerInstance.post<ISignInResponse>('/api/auth/signin', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while signin at next serverSide: ${error}`);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosNextServerInstance.post('/api/auth/signout');
  } catch (error) {
    throw new Error(`Error while logging out: ${error}`);
  }
};