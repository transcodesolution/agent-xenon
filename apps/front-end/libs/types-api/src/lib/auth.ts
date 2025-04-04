import { UserType } from "@agent-xenon/constants";

export interface ISignInRequest {
  name: string;
  email: string;
  password: string;
  userType?: UserType;
}

export interface ISignInResponse {
  status: number,
  message: string,
  data: {
    userType: string,
    firstName: string,
    lastName: string,
    _id: string,
    email: string,
    token: string
  }
}