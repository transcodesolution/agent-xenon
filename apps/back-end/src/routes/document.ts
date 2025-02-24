import express from 'express';
import { sendS3DocumentLinks } from '../helper/middleware';
import { uploadToS3UsingMulter } from '../utils/s3';

const upload = uploadToS3UsingMulter();

const router = express.Router();

router.post("/upload", upload.array("document"), sendS3DocumentLinks);

export const documentRouter = router;