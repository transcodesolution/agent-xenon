import express from 'express';
import { createJob, deleteJob, getJob, getJobById, updateJob } from '../controllers/job/job';
const router = express.Router();

router.post("/create", createJob);
router.patch("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);
router.get("/", getJob);
router.get("/:jobId", getJobById);

export const jobRouter = router;