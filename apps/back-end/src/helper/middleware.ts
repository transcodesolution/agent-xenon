import { RoleTypes } from "@agent-xenon/constants";
import { NextFunction, Request, Response } from "express";

export const VALIDATE_ROLE = (roles: Array<string>) => async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.headers;
    try {
        if (typeof user.roleId !== "string") {
            if (user.roleId.name === RoleTypes.ADMINISTRATOR) {
                return next();
            }

            if (roles.includes(user.roleId.name)) {
                return next();
            }
            return res.unAuthorizedAccess("invalidAction", {})
        }
    } catch (err) {
        console.log(err);
        return res.unAuthorizedAccess("unauthorized", {})
    }
}