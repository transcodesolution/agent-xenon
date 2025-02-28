import express from 'express';
import { addResumeUrl, createJob, deleteJob, deleteResumeUrls, getJob, getJobById, getJobRoleAndDesignation, getResumesUrlsByJobId, updateJob } from '../controllers/job/job';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';

const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.JOB_CREATE]), createJob);
router.patch("/:jobId", validateRoleAndPermissions([Permission.JOB_UPDATE]), updateJob);
router.delete("/", validateRoleAndPermissions([Permission.JOB_DELETE]), deleteJob);
router.get("/", validateRoleAndPermissions([Permission.JOB_READ]), getJob);
router.get("/job-role-and-designation", validateRoleAndPermissions([Permission.JOB_UPDATE]), getJobRoleAndDesignation);
router.get("/:jobId", validateRoleAndPermissions([Permission.JOB_READ]), getJobById);
router.post("/resume-url/add", validateRoleAndPermissions([Permission.JOB_CANDIDATES_TAB]), addResumeUrl);
router.delete("/resume-url/:jobId", validateRoleAndPermissions([Permission.JOB_CANDIDATES_TAB]), deleteResumeUrls);
router.get("/resume-url/:jobId", validateRoleAndPermissions([Permission.JOB_CANDIDATES_TAB]), getResumesUrlsByJobId);

export const jobRouter = router;