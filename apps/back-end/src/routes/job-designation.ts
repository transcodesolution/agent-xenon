import express from 'express';
import { createJobDesignation, deleteJobDesignation, getJobDesignation, updateJobDesignation } from '../controllers/jobDesignation/job-designation';
import { Permission } from '@agent-xenon/constants';
import { validateRoleAndPermissions } from '../helper/middleware';
const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.DESIGNATION_CREATE]), createJobDesignation);
router.put("/:designationId", validateRoleAndPermissions([Permission.DESIGNATION_UPDATE]), updateJobDesignation);
router.delete("/:designationId", validateRoleAndPermissions([Permission.DESIGNATION_DELETE]), deleteJobDesignation);
router.get("/", validateRoleAndPermissions([Permission.DESIGNATION_READ]), getJobDesignation);

export const designationRouter = router;