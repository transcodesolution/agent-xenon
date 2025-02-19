import { ISignInRequest, ISignInResponse } from "@/libs/types-api/src";
import axios from "axios";

export const signIn = async (params: ISignInRequest): Promise<ISignInResponse> => {
  try {
    const result = await axios.post<ISignInResponse>('/api/auth/signin', params);
    return result.data;
  } catch (error) {
    throw new Error(`Error while creating job: ${error}`);
  }
};