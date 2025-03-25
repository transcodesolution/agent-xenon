import { IOrganization, IUser } from "@agent-xenon/interfaces";

export interface IGetUserResponse {
  userData: IUser;
  organizationData: IOrganization;
}

export interface IGetUsersRequest {
  page: number;
  limit: number;
  search: string
}
export interface IGetUsersResponse {
  userData: IUser[];
  totalData: number
}

export interface IGetUserByIdRequest {
  id: string
}
export interface IGetUserByIdResponse {
  user: IUser
}

export interface IUpdateUserResponse {
  user: IUser
}