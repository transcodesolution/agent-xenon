import { sign } from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (data = {}) => {
    const token = sign(data, config.JWT_TOKEN_SECRET);
    return token;
}