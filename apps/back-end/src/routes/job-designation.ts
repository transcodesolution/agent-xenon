import express from 'express';
import { createJobDesignation, deleteJobDesignation, getJobDesignation, getJobDesignationById, updateJobDesignation } from '../controllers/jobDesignation/job-designation';
import { Permission } from '@agent-xenon/constants';
import { validateRoleAndPermissions } from '../helper/middleware';

const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.DESIGNATION_CREATE]), createJobDesignation);
router.put("/:designationId", validateRoleAndPermissions([Permission.DESIGNATION_UPDATE]), updateJobDesignation);
router.delete("/", validateRoleAndPermissions([Permission.DESIGNATION_DELETE]), deleteJobDesignation);
router.get("/", validateRoleAndPermissions([Permission.DESIGNATION_READ]), getJobDesignation);
router.get("/:designationId", validateRoleAndPermissions([Permission.DESIGNATION_READ]), getJobDesignationById);

export const designationRouter = router;