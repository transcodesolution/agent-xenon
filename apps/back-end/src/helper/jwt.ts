import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { config } from '../config'
import { User } from '../database'
import Applicant from '../database/models/applicant';
import { IApplicant, IEmployee, IRole, IUser } from '@agent-xenon/interfaces';
import { RoleType } from '@agent-xenon/constants';
import { Socket } from 'socket.io';
import Employee from '../database/models/employee';

const jwt_token_secret = config.JWT_TOKEN_SECRET;

declare module "jsonwebtoken" {
    interface JwtPayload {
        _id: string;
        type: RoleType;
        organizationId: string;
        orgName: string;
        status: string;
        generatedOn: string;
    }
}

export const JWT = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (authorization) {
        try {
            const isVerifyToken = jwt.verify(authorization, jwt_token_secret);
            const checkToken = typeof isVerifyToken !== "string";
            if (process?.env?.NODE_ENV == 'production' && checkToken) {
                // 1 day expiration
                if (parseInt(isVerifyToken.generatedOn + 86400000) < new Date().getTime()) {
                    // if (parseInt(isVerifyToken.generatedOn + 120000) < new Date().getTime()) {
                    return res.unAuthorizedAccess("tokenExpire", {})
                }
            }

            const organizationName = "organization";
            const roleName = "role";

            if (checkToken) {
                const Query = { _id: isVerifyToken?._id, deletedAt: null };
                let result: IUser | IApplicant | IEmployee;

                if (isVerifyToken.type === RoleType.CANDIDATE) {
                    result = await Applicant.findOne(Query).populate(roleName).populate(organizationName);
                } else if (isVerifyToken.type === RoleType.EMPLOYEE) {
                    result = await Employee.findOne(Query).populate(roleName).populate(organizationName);
                } else {
                    result = await User.findOne(Query).populate(roleName).populate(organizationName);
                }

                if (isVerifyToken.organizationId !== result.organizationId.toString()) {
                    return res.forbidden("differentToken", {});
                }
                if (result) {
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

export const socketJWTAndRoomJoin = async (socket: Socket) => {
    const { authorization } = socket.handshake.headers;
    if (authorization) {
        const isVerifyToken = jwt.verify(authorization, config.JWT_TOKEN_SECRET);
        const checkToken = typeof isVerifyToken !== "string";
        if (process?.env?.NODE_ENV == 'production' && checkToken) {
            // 1 day expiration
            if (parseInt(isVerifyToken.generatedOn + 86400000) < new Date().getTime()) {
                // if (parseInt(isVerifyToken.generatedOn + 120000) < new Date().getTime()) {
                return socket.emit("round-status", { status: "Error", message: "Token has been expired!" });
            }
        }
        if (checkToken) {
            const Query = { _id: isVerifyToken?._id, deletedAt: null };
            const result = await User.findOne(Query).populate<{ role: IRole }>("role");
            if (isVerifyToken.organizationId !== result?.organizationId.toString()) {
                return socket.emit("round-status", { status: "Error", message: "Do not try a different organization token!" });
            }
            if (result) {
                socket.join(isVerifyToken.organizationId);
                return socket.emit("round-status", { status: "Success", message: "You have joined the organization room!" });
            } else {
                return socket.emit("round-status", { status: "Error", message: "Invalid token" });
            }
        }
    }
    return socket.emit("round-status", { status: "Error", message: "We can't find valid token in header!" });
}