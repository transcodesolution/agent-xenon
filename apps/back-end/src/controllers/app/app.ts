import { Request, Response } from "express";
import { IApp, IOrganization } from "@agent-xenon/interfaces";
import { oauth2Client } from "../../helper/third-party-oauth";
import { App } from "@agent-xenon/constants";
import { generateGoogleAuthUrl, getAppDataByType } from "../../utils/interview-round";
import { googleRedirectSchema } from "../../validation/interview-round";
import Organization from "../../database/models/organization";
import { IConnectAppResponse } from "../../types/third-party-api";
import { connectAppSchema, onBoardAppSchema } from "../../validation/app";
import { checkGoogleTokenExpiry } from "../../utils/google-service";
import AppModel from "../../database/models/app";

interface IGetAppQueryResponse extends IApp, Pick<IOrganization, "serviceProviders"> { }

export const getApp = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const apps = await Organization.aggregate<IGetAppQueryResponse>([
            {
                $match: { _id: user.organizationId, deletedAt: null }
            },
            {
                $lookup: {
                    from: "apps",
                    let: { appIds: "$serviceProviders.appId" },
                    as: "apps",
                    pipeline: [{
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $in: ["$_id", "$$appIds"]
                                    },
                                    {
                                        $ne: ["$_id", "$$appIds"]
                                    }
                                ]
                            }
                        }
                    }]
                }
            },
            {
                $unwind: {
                    path: "$apps",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$apps._id",
                    name: "$apps.name",
                    isAppConnect: { $cond: [{ $in: ["$apps._id", { $ifNull: ["$serviceProviders.appId", []] }] }, true, false] },
                    serviceProviders: 1,
                }
            },
        ]);

        for (const app of apps) {
            if (app.isAppConnect) {
                const expiryResponse = await checkGoogleTokenExpiry(app.serviceProviders, app._id.toString(), user.organizationId.toString());
                if (!expiryResponse.isExpired) {
                    app.isAppConnect = false;
                }
            }
            delete app.serviceProviders;
        }

        return res.ok('app', { apps }, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const connectApp = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = connectAppSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkAppExist = await AppModel.findOne({ _id: value.appId });

        if (!checkAppExist) {
            return res.badRequest("app", {}, 'getDataNotFound');
        }

        const responseObj: IConnectAppResponse = { redirectUrl: "" };

        switch (checkAppExist.name) {
            case App.GOOGLE:
                responseObj.redirectUrl = await generateGoogleAuthUrl(user.organizationId.toString());
                break;
        }

        return res.ok('app connect redirect url generated successfully', responseObj, 'customMessage');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const disconnectApp = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = connectAppSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkAppExist = await AppModel.findOne({ _id: value.appId });

        if (!checkAppExist) {
            return res.badRequest("app", {}, 'getDataNotFound');
        }

        await Organization.updateOne({ _id: user.organizationId, deletedAt: null }, { $pull: { serviceProviders: { appId: value.appId } } });

        return res.ok('app disconnected successfully', {}, 'customMessage');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const onBoardApp = async (req: Request, res: Response) => {
    try {
        const { error, value } = onBoardAppSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const existingApp = await AppModel.findOne({ name: value.name });
        if (existingApp) {
            return res.badRequest("An app with this name already exists", {}, "customMessage");
        }

        const appData = await AppModel.create(value);

        return res.ok('app', { appData }, 'addDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const googleAuthRedirectLogic = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        const organizationId = req.query.state as string;

        const { error, value } = googleRedirectSchema.validate({ organizationId });

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkOrganizationId = await Organization.findOne({ _id: value.organizationId, deletedAt: null });

        if (!checkOrganizationId) {
            return res.badRequest("organization", {}, "getDataNotFound");
        }

        const appData = await getAppDataByType(App.GOOGLE);

        const findGoogleApp = checkOrganizationId.serviceProviders.find((i) => i.appId.toString() === appData._id.toString());

        if (findGoogleApp && findGoogleApp.expiry > new Date()) {
            return res.badRequest("You have already logged in with google. Can't perform multiple times", {}, "customMessage");
        }

        const { tokens } = await oauth2Client.getToken(code);

        await Organization.updateOne({ _id: organizationId }, { $push: { serviceProviders: { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, scope: tokens.scope, expiry: tokens.expiry_date, appId: appData._id } } });

        return res.ok("login with google successful", {}, "customMessage");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage");
    }
}