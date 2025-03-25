import express from 'express';
import { sendS3DocumentLinks, validateRoleAndPermissions } from '../helper/middleware';
import { uploadToS3UsingMulter } from '../utils/s3';
import { Permission } from '@agent-xenon/constants';

const upload = uploadToS3UsingMulter();

const router = express.Router();

router.use(validateRoleAndPermissions([Permission.JOB_CANDIDATES_TAB]));
router.post("/upload", upload.array("document"), sendS3DocumentLinks);

export const documentRouter = router;