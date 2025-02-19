import axios from "axios";
import { ISignInRequest, ISignInResponse } from "@/libs/types-api/src/lib/auth";

export const signIn = async (params: ISignInRequest): Promise<ISignInResponse> => {
  try {
    const result = await axios.post<ISignInResponse>('/api/auth/signin', params);
    console.log(result, 'result')
    return result.data;
  } catch (error) {
    throw new Error(`Error while creating job: ${error}`);
  }
};