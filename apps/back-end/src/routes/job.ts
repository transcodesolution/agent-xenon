import express from 'express';
import { addResumeUrl, createJob, deleteJob, deleteResumeUrls, getJob, getJobById, getJobRoleAndDesignation, getResumesUrlsByJobId, updateJob } from '../controllers/job/job';
const router = express.Router();

router.post("/create", createJob);
router.patch("/:jobId", updateJob);
router.delete("/", deleteJob);
router.get("/", getJob);
router.get("/job-role-and-designation", getJobRoleAndDesignation);
router.get("/:jobId", getJobById);
router.post("/resume-url/add", addResumeUrl);
router.delete("/resume-url/:jobId", deleteResumeUrls);
router.get("/resume-url/:jobId", getResumesUrlsByJobId);

export const jobRouter = router;