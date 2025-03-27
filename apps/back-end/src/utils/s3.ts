import { DeleteObjectsCommand, DeleteObjectsCommandInput, PutObjectCommand, PutObjectCommandInput, S3, } from '@aws-sdk/client-s3';
import { config } from '../config';
import { FileDataType } from '../types/response-data';
import multer from "multer";
import multers3 from "multer-s3";
import { Request } from 'express';
import { generateRandomString } from './random-string-generator';

const s3bucket = new S3({
    region: config.REGION,
    credentials: {
        accessKeyId: config.AWS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    }
});

export const s3UploadDocument = async (document: FileDataType, folderName = "resumes") => {
    let imageUrl = '';
    let imageKey = '';

    if (!config.AWS_KEY_ID) {
        throw new Error("Missing aws keys");
    }

    if (document) {
        const objectKey = `${folderName}/${document.originalname + new Date().getTime()}`;

        const params: PutObjectCommandInput = {
            Bucket: config.BUCKET_NAME,
            Key: objectKey,
            Body: document.buffer,
            ContentType: document.mimetype,
        };

        await s3bucket.send(new PutObjectCommand(params));

        imageKey = objectKey;
        imageUrl = `https://${config.BUCKET_NAME}.s3.${config.REGION}.amazonaws.com/${objectKey}`;
    }

    return { imageUrl, imageKey };
};

export const s3deleteObjects = async (resumeUrls: string[]) => {
    if (!config.AWS_KEY_ID) {
        throw new Error("Missing aws keys");
    }

    const params: DeleteObjectsCommandInput = {
        Bucket: config.BUCKET_NAME,
        Delete: { Objects: resumeUrls.map((key) => ({ Key: key.replace(`https://${config.BUCKET_NAME}.s3.${config.REGION}.amazonaws.com/`, "") })) },
    };

    await s3bucket.send(new DeleteObjectsCommand(params));
};

export const uploadToS3UsingMulter = () => {
    const upload = multer({
        storage: multers3({
            s3: s3bucket,
            bucket: config.BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req: Request, file: FileDataType, cb) {
                const ext = file.mimetype.split('/')[1];
                const filename = `org-${req.headers.user.organizationId
                    }/${req.body.folderName ?? 'resumes'}/${generateRandomString(5)}-${Date.now()}.${ext}`;
                cb(null, filename);
            },
        }),
        // limits: {
        //     fileSize: 5000000,
        // },
    });

    return upload;
}