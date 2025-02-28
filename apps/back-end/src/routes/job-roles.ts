import express from 'express';
import { createJobRole, deleteJobRole, getJobRoles, updateJobRole } from "../controllers/jobRoles/job-role";
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';

const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.JOB_ROLE_CREATE]), createJobRole);
router.put("/:jobRoleId", validateRoleAndPermissions([Permission.JOB_ROLE_UPDATE]), updateJobRole);
router.delete("/:jobRoleId", validateRoleAndPermissions([Permission.JOB_ROLE_DELETE]), deleteJobRole);
router.get("/", validateRoleAndPermissions([Permission.JOB_ROLE_READ]), getJobRoles);

export const jobRoleRouter = router;