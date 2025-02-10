import express from 'express';
import { createJobDesignation, deleteJobDesignation, getJobDesignation, updateJobDesignation } from '../controllers/jobDesignation/job-designation';
const router = express.Router();

router.post("/create", createJobDesignation);
router.put("/:designationId", updateJobDesignation);
router.delete("/:designationId", deleteJobDesignation);
router.get("/", getJobDesignation);

export const designationRouter = router;