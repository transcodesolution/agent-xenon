import { NextFunction, Request, Response } from "express";
import { responseMessage } from "./response";
import STATUS_CODES from "./statusCodes";
import { ResponseDataType } from "../utils/types";
import { IUser } from "@agent-xenon/interfaces";
import { IncomingHttpHeaders } from "http";

declare module "express" {
    interface Response {
        ok(errorMsg: string, data?: ResponseDataType, methodName?: string): Response;
        badRequest(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
        internalServerError(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
        unAuthorizedAccess(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
        notFound(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
        badGateway(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
        forbidden(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
        resourceUnavailable(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
    }

    interface Request {
        headers: IncomingHttpHeaders & {  // Preserve existing headers
            user?: IUser;
            userType?: string;
        };
    }
}

const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    res.ok = (errorMsg: string, data?: ResponseDataType, methodName?: string) => {
        return res.status(STATUS_CODES.SUCCESS).json({
            status: STATUS_CODES.SUCCESS,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            data: data ?? null,
        });
    };

    res.badRequest = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            status: STATUS_CODES.BAD_REQUEST,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.forbidden = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.FORBIDDEN).json({
            status: STATUS_CODES.FORBIDDEN,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.resourceUnavailable = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.RESOURCE_NOT_FOUND).json({
            status: STATUS_CODES.RESOURCE_NOT_FOUND,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.badRequest = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            status: STATUS_CODES.BAD_REQUEST,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.internalServerError = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.unAuthorizedAccess = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            status: STATUS_CODES.UNAUTHORIZED,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.notFound = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            status: STATUS_CODES.NOT_FOUND,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    res.badGateway = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.BAD_GATEWAY).json({
            status: STATUS_CODES.BAD_GATEWAY,
            message: typeof responseMessage[errorMsg] === "string"
                ? responseMessage[errorMsg]
                : responseMessage[methodName](errorMsg),
            error: error ?? null,
        });
    };

    next();
};

export default responseHandler;