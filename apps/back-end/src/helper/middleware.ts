import { Permission, RoleTypes } from "@agent-xenon/constants";
import { NextFunction, Request, Response } from "express";
import { FileDataType } from "../types/response-data";

export const validateRoleAndPermissions = (permissions: Permission[]) => async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.headers;
    try {
        if (typeof user.roleId !== "string") {
            if (user.roleId.type === RoleTypes.ADMINISTRATOR) {
                return next();
            }

            if (permissions.find((permission) => user.roleId.permissions.includes(permission))) {
                return next();
            }
            return res.forbidden("invalidAction", {})
        }
    } catch (error) {
        console.error("validateRoleAndPermissions: ", error)
        return res.unAuthorizedAccess("unauthorized", {})
    }
}

export const sendS3DocumentLinks = async (req: Request, res: Response) => {
    try {
        const fileObject = req.files as FileDataType[] ?? [];

        return res.ok("resumes uploaded successfully", { resumeUrls: fileObject.map((i) => (i.location)) }, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}