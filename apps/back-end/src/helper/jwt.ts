import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { config } from '../config'
import { userModel } from '../database'

const ObjectId = require("mongoose").Types.ObjectId
const jwt_token_secret = config.JWT_TOKEN_SECRET;

declare module "jsonwebtoken" {
    interface JwtPayload {
        _id: string | null;
        generatedOn: string;
    }
}

export const JWT = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization, userType } = req.headers;
    if (authorization) {
        try {
            const isVerifyToken = jwt.verify(authorization, jwt_token_secret);
            const checkToken = typeof isVerifyToken !== "string";
            // if (isVerifyToken?.type != userType && userType != "5") return res.status(403).json(new apiResponse(403, responseMessage?.accessDenied, {}, {}));
            if (process?.env?.NODE_ENV == 'production' && checkToken) {
                // 1 day expiration
                if (parseInt(isVerifyToken.generatedOn + 86400000) < new Date().getTime()) {
                    // if (parseInt(isVerifyToken.generatedOn + 120000) < new Date().getTime()) {
                    return res.resourceUnavailable("tokenExpire", {})
                }
            }

            if (checkToken) {
                const result = await userModel.findOne({ _id: ObjectId(isVerifyToken?._id), deletedAt: null }).populate("roleId");
                // if (result?.isBlocked) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
                if (!result?.deletedAt) {
                    // Set in Header Decode Token Information
                    req.headers.user = result;
                    return next();
                } else {
                    return res.unAuthorizedAccess("invalidToken", {});
                }
            }

        } catch (err) {
            if (err.message == "invalid signature") return res.forbidden("differentToken", {})
            return res.unAuthorizedAccess("invalidToken", {});
        }
    } else {
        return res.unAuthorizedAccess("tokenNotFound", {})
    }
}
