import { sign } from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (data = {}) => {
    const token = sign(data, config.JWT_TOKEN_SECRET);
    return token;
}

export function createEncodedShortToken(roundId: string, jobId: string, orgName: string) {
    return Buffer.from(`${roundId}_${jobId}_${orgName}`).toString("base64").replace(/=/g, "");
}

export function decodeEncodedToken(token: string) {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [roundId, jobId, orgName] = decoded.split("_");
    return { roundId, jobId, orgName };
}