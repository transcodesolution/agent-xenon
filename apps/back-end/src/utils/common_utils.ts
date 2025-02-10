import { config } from "../config";
import { userModel } from "../database";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import axios from 'axios';
import path from "path";
import fs from 'fs';

// const ObjectId = require("mongoose").Types.ObjectId

const jwt_token_secret = config.JWT_TOKEN_SECRET;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

export const getUniqueOtp = async () => {
    let otp;
    let isUnique = false;

    while (!isUnique) {
        otp = generateOtp(); // Generate a 6-digit OTP
        const isAlreadyAssign = await userModel.findOne({ otp });
        if (!isAlreadyAssign) {
            isUnique = true; // Exit the loop if the OTP is unique
        }
    }

    return otp;
};

export const convertISTHoursToUTCDate = (istTime: string): Date => {  // 11:00 to UTC date formate
    const [hours, minutes] = istTime.split(':').map(Number);
    const utcDate = new Date();
    utcDate.setHours(hours, minutes, 0, 0);
    console.log(utcDate)
    return utcDate;
}

export const convertISTToUTC = (date: Date): Date => {
    const utcData = new Date(date);
    utcData.setHours(utcData.getHours() - 5);
    utcData.setMinutes(utcData.getMinutes() - 30);
    return utcData;
}

export const generateHash = async (password = '') => {
    const salt = await bcryptjs.genSaltSync(10)
    const hashPassword = await bcryptjs.hash(password, salt)
    return hashPassword
}

export const compareHash = async (password = '', hashPassword = '') => {
    const passwordMatch = await bcryptjs.compare(password, hashPassword)

    return passwordMatch
}

export const generateToken = (data = {}) => {
    const token = jwt.sign(data, jwt_token_secret)
    return token
}

export const getVideoFile = async (filePath: string) => {
    const videoFilePath = path.join(__dirname, filePath);
    const videoFile = await fs.promises.readFile(videoFilePath);
    const videoSize = (await fs.promises.stat(videoFilePath)).size;

    return { videoFile, videoSize }
}

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumberForUniqueId(min = 1000000, max = 9000000) {
    return Math.floor(min + Math.random() * max);
}

export function paginateArray(data: Array<any>, page: number, limit: number) {
    // Calculate the starting index based on the page and limit
    const skip = (page - 1) * limit;

    // Use slice to apply skip and limit
    return data.slice(skip, skip + limit);
}

// export const uploadImageToS3 = (fileName: string, fileLocalName: string, folderPath: string) => {
//     const image = fs.readFileSync(
//         path.join(
//             __dirname,
//             "../../../error-screenshots/" + fileLocalName
//         ),
//         { encoding: "base64" }
//     );
//     return s3UploadImage(
//         {
//             buffer: Buffer.from(image, "base64"),
//             mimetype: "image/png",
//             originalname: `${fileName}_`,
//         },
//         "scripts/error_screenshots/" + folderPath
//     );
// }

export const getFutureMonthDate = () => (Date.now() + 2592000000);

const apiRequestHandler = async (httpMethod: 'get' | 'post' | 'put' | 'delete', url: string, { queryParams = {}, requestBody = {}, ...axiosConfig } = {}) => {
    try {
        const response = await axios[httpMethod](url + '?' + new URLSearchParams(queryParams).toString(), httpMethod === 'get' ? {} : requestBody, {
            timeout: 60000,
            ...axiosConfig
        });

        return { data: response.data, status: response.status };
    } catch (error) {
        throw {
            error: error.response ? error.response.data : error.message,
            status: error.response ? error.response.status : 500
        };
    }
};

// export const uploadSingleVideo = async (video, videoPath) => {
//     try {
//         const { videoUrl } = await s3UploadVideo(video, videoPath);
//         return videoUrl;
//     } catch (error) {
//         console.log("error => ", error);
//         return '';
//     }
// }

export const getMemoryUsage = () => {
    const memoryUsage = process.memoryUsage();
    console.log(`Heap Used memoryUsage:`, memoryUsage);

    const totalMemory = memoryUsage.rss + memoryUsage.heapTotal + memoryUsage.external + memoryUsage.heapUsed + memoryUsage.arrayBuffers;
    // console.log(`totalMemory:`, totalMemory);

    console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
    console.log(`Total Memory: ${totalMemory / 1024 / 1024} MB`);
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDifferenceInDays = (date1, date2) => {
    const differenceInTime = date1.getTime() - date2.getTime();
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
}

export const getDateAfterDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

export function generateRandomString(length: number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}