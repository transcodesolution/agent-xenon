import { google } from "googleapis";
import { config } from "../config";

export let oauth2Client;

export const createGoogleOAuth = () => {
    oauth2Client = new google.auth.OAuth2(
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_CLIENT_SECRET,
        config.GOOGLE_REDIRECT_URI
    );
}