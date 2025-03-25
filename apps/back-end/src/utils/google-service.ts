import { IServiceProvider } from "@agent-xenon/interfaces";
import { oauth2Client } from "../helper/third-party-oauth";
import { getAppDataByType } from "./interview-round";
import { App } from "@agent-xenon/constants";
import Organization from "../database/models/organization";

export const checkGoogleTokenExpiry = async (serviceProviders: IServiceProvider[], appId: string, organizationId: string) => {
    try {
        const findGoogleApp = serviceProviders?.find((i) => i.appId.toString() === appId);
        if (!findGoogleApp) {
            return { isExpired: false, message: "google login required! to process further" };
        } else if (findGoogleApp.expiry <= new Date()) {
            const { accessToken, expiry, refreshToken, scope } = findGoogleApp;
            oauth2Client.setCredentials({ access_token: accessToken, expiry_date: expiry.getTime(), refresh_token: refreshToken, scope });
            const { credentials } = await oauth2Client.refreshAccessToken();
            oauth2Client.setCredentials(credentials);
        } else {
            const { accessToken, expiry, scope } = findGoogleApp;
            oauth2Client.setCredentials({ access_token: accessToken, expiry_date: expiry.getTime(), scope });
        }
        return { isExpired: true };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error === "invalid_grant") {
            const appData = await getAppDataByType(App.GOOGLE);
            await Organization.updateOne({ _id: organizationId, deletedAt: null }, { $pull: { serviceProviders: { appId: appData._id } } });
            return { isExpired: false, message: "google login required! to process further" };
        } else {
            throw new Error(error.message);
        }
    }
}