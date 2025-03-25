import { RoleType } from "@agent-xenon/constants";
import { IRole } from "@agent-xenon/interfaces";

export function checkSystemRoles(roles: IRole[], isAdmistratorRole: boolean) {
    return roles.some((i) => i?.type === (isAdmistratorRole ? RoleType.ADMINISTRATOR : RoleType.CANDIDATE));
}