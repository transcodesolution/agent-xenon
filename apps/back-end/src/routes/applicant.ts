import express from 'express';
import { createApplicantByAgent, createApplicantByUser, deleteApplicant, getApplicants, updateApplicant } from '../controllers/applicants/applicant';
const router = express.Router();

router.post("/createByUser", createApplicantByUser);
router.post("/createByAgent", createApplicantByAgent);
router.put("/:applicantId", updateApplicant);
router.delete("/:applicantId", deleteApplicant);
router.get("/", getApplicants);

export const applicantRouter = router;