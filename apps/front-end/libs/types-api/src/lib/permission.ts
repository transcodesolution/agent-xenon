import { Permission } from "@agent-xenon/constants";

export interface IGetPermissionsResponse {
  message: string;
  data: {
    permissions: Permission[]
  }
}