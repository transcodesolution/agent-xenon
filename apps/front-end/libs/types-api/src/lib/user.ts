import { IOrganization, IUser } from "@agent-xenon/interfaces";

export interface IGetUserResponse {
  userData: IUser;
  organizationData: IOrganization;
}