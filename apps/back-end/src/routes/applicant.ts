import express from 'express';
import { createApplicantByAgent, createApplicantByUser, deleteApplicant, getApplicantById, getApplicantDetailGlobally, getApplicants, updateApplicant } from '../controllers/applicants/applicant';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
const router = express.Router();

const commonPermissions = [Permission.JOB_CANDIDATES_TAB];

router.post("/createByUser", validateRoleAndPermissions(commonPermissions), createApplicantByUser);
router.post("/createByAgent", validateRoleAndPermissions(commonPermissions), createApplicantByAgent);
router.put("/:applicantId", validateRoleAndPermissions(commonPermissions), updateApplicant);
router.delete("/", validateRoleAndPermissions(commonPermissions), deleteApplicant);
router.get("/", validateRoleAndPermissions([Permission.APPLICANT_READ, ...commonPermissions]), getApplicants);
router.get("/global-detail/:applicantId", validateRoleAndPermissions([Permission.APPLICANT_READ]), getApplicantDetailGlobally);
router.get("/:applicantId", validateRoleAndPermissions(commonPermissions), getApplicantById);

export const applicantRouter = router;