import { Request, Response } from "express";
import { codeExecuteSchema } from "../../validation/code-execution";
import apiRequestHandler from "../../utils/third-party-service-handler";
import { PINSTON_API } from "../../utils/constants";

export const executeCode = async (req: Request, res: Response) => {
    try {
        const { error, value } = codeExecuteSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const outputDetails = await apiRequestHandler("post", PINSTON_API.runCode, {
            requestBody: {
                language: value.language,
                version: value.version,
                files: [{ name: "main", content: value.code }]
            },
        });

        return res.ok("interview round", outputDetails.data?.run ?? {}, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error?.message ?? error?.error?.message, error?.stack ?? {}, "customMessage")
    }
}