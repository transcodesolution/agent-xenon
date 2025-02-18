import express from 'express';
import { createJob, deleteJob, getJob, getJobById, getJobRoleAndDesignation, updateJob } from '../controllers/job/job';
const router = express.Router();

router.post("/create", createJob);
router.patch("/:jobId", updateJob);
router.delete("/", deleteJob);
router.get("/", getJob);
router.get("/job-role-and-designation", getJobRoleAndDesignation);
router.get("/:jobId", getJobById);

export const jobRouter = router;