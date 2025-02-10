import bcryptjs from "bcryptjs";

export const generateHash = async (password = '') => {
    const salt = await bcryptjs.genSaltSync(10)
    const hashPassword = await bcryptjs.hash(password, salt)
    return hashPassword
}

export const compareHash = async (password = '', hashPassword = '') => {
    const passwordMatch = await bcryptjs.compare(password, hashPassword)

    return passwordMatch
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

// const apiRequestHandler = async (httpMethod: 'get' | 'post' | 'put' | 'delete', url: string, { queryParams = {}, requestBody = {}, ...axiosConfig } = {}) => {
//     try {
//         const response = await axios[httpMethod](url + '?' + new URLSearchParams(queryParams).toString(), httpMethod === 'get' ? {} : requestBody, {
//             timeout: 60000,
//             ...axiosConfig
//         });

//         return { data: response.data, status: response.status };
//     } catch (error) {
//         throw {
//             error: error.response ? error.response.data : error.message,
//             status: error.response ? error.response.status : 500
//         };
//     }
// };

// export const uploadSingleVideo = async (video, videoPath) => {
//     try {
//         const { videoUrl } = await s3UploadVideo(video, videoPath);
//         return videoUrl;
//     } catch (error) {
//         console.log("error => ", error);
//         return '';
//     }
// }