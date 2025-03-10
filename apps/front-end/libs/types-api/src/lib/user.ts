import { IOrganization, IRole, IUser } from "@agent-xenon/interfaces";

export interface IGetUserResponse {
  userData: IUser<IRole>;
  organizationData: IOrganization;
}