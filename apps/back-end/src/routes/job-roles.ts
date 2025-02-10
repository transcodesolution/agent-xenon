import express from 'express';
import { createJobRole, deleteJobRole, getJobRoles, updateJobRole } from "../controllers/jobRoles/job-role";

const router = express.Router();

router.post("/create", createJobRole);
router.put("/:jobRoleId", updateJobRole);
router.delete("/:jobRoleId", deleteJobRole);
router.get("/", getJobRoles);

export const jobRoleRouter = router;