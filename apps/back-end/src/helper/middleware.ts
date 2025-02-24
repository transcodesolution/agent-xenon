import { RoleTypes } from "@agent-xenon/constants";
import { NextFunction, Request, Response } from "express";
import { FileDataType } from "../types/response-data";

export const validateRole = (roles: Array<string>) => async (req: Request, res: Response, next: NextFunction) => {
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

export const sendS3DocumentLinks = async (req: Request, res: Response) => {
    try {
        const fileObject = req.files as FileDataType[] ?? [];

        return res.ok("resumes uploaded successfully", { resumeUrls: fileObject.map((i) => (i.location)) }, "customMessage")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}