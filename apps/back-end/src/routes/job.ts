import express from 'express';
import { createJob, deleteJob, getJob, updateJob } from '../controllers/job/job';
const router = express.Router();

router.post("/create", createJob);
router.patch("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);
router.get("/", getJob);

export const jobRouter = router;