import { Request, Response } from "express";
import { codeExecuteSchema } from "../../validation/code-execution";
import apiRequestHandler from "../../utils/third-party-service-handler";
import { PINSTON_API } from "../../utils/constants";
import { IExecuteCodeResponse } from "../../types/response-data";

export const executeCode = async (req: Request, res: Response) => {
    try {
        const { error, value } = codeExecuteSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const outputDetails: { data: IExecuteCodeResponse, status: number } = await apiRequestHandler("post", PINSTON_API.execute, {
            requestBody: {
                language: value.language,
                version: value.version,
                files: [{ name: "main", content: value.code }]
            },
        });

        return res.ok("code execution completed successfully", outputDetails.data?.run ?? {}, "customMessage")
    } catch (error) {
        return res.internalServerError(error?.message ?? error?.error?.message, error?.stack ?? {}, "customMessage")
    }
}