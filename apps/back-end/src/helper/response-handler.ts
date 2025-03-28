import { NextFunction, Request, Response } from "express";
import { responseMessage } from "./response-message";
import STATUS_CODES from "./status-codes";
import { IApplicant, IInterviewRound, IJob, IUser } from "@agent-xenon/interfaces";
import { IncomingHttpHeaders } from "http";
import { ResponseDataType } from "../types/response-data";

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
        expectationFailed(errorMsg: string, error: ResponseDataType, methodName?: string): Response;
    }

    interface Request {
        headers: IncomingHttpHeaders & {  // Preserve existing headers
            user?: IApplicant | Partial<IUser>;
            interviewRoundData?: IInterviewRound<IJob>,
        };
    }
}

const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    res.ok = (errorMsg: string, data?: ResponseDataType, methodName?: string) => {
        return res.status(STATUS_CODES.SUCCESS).json({
            status: STATUS_CODES.SUCCESS,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            data: data ?? null,
        });
    };

    res.badRequest = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            status: STATUS_CODES.BAD_REQUEST,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.expectationFailed = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.EXPECTATION_FAILED).json({
            status: STATUS_CODES.EXPECTATION_FAILED,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.forbidden = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.FORBIDDEN).json({
            status: STATUS_CODES.FORBIDDEN,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.resourceUnavailable = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.RESOURCE_NOT_FOUND).json({
            status: STATUS_CODES.RESOURCE_NOT_FOUND,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.badRequest = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            status: STATUS_CODES.BAD_REQUEST,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.internalServerError = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.unAuthorizedAccess = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            status: STATUS_CODES.UNAUTHORIZED,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.notFound = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            status: STATUS_CODES.NOT_FOUND,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    res.badGateway = function (errorMsg: string, error?: ResponseDataType, methodName?: string): Response {
        return res.status(STATUS_CODES.BAD_GATEWAY).json({
            status: STATUS_CODES.BAD_GATEWAY,
            message: methodName
                ? responseMessage[methodName](errorMsg)
                : responseMessage[errorMsg],
            error: error ?? null,
        });
    };

    next();
};

export default responseHandler;