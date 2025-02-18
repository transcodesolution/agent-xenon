import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  REFRESH_JWT_TOKEN_SECRET: process.env.REFRESH_JWT_TOKEN_SECRET,
  AWS_KEY_ID: process.env.AWS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  REGION: process.env.REGION,
  BUCKET_NAME: process.env.BUCKET_NAME,
  BUCKET_URL: process.env.BUCKET_URL,
  MAIL: process.env.MAIL,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  SERVICE: process.env.SERVICE,
  FCM_KEY: process.env.FCM_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL,
  ENV: process.env.ENV,
  S3_BUCKET_KEY: process.env.S3_BUCKET_KEY,
  CORS: process.env.CORS
}