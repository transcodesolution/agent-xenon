import express from 'express';
import { createInterviewRound, deleteInterviewRound, getInterviewRoundByJobId, getInterviewRoundsById, getRoundByIdAndApplicantId, manageInterviewRound, updateInterviewRound, updateRoundOrder, updateRoundStatus } from '../controllers/interview-rounds/interview-round';
import { validateInterviewRound, validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.INTERVIEW_ROUND_CREATE]), createInterviewRound);
router.patch("/order-update", validateRoleAndPermissions([Permission.ROUND_ORDER_UPDATE]), updateRoundOrder);
router.patch("/:roundId", validateRoleAndPermissions([Permission.INTERVIEW_ROUND_UPDATE]), updateInterviewRound);
router.delete("/", validateRoleAndPermissions([Permission.INTERVIEW_ROUND_DELETE]), deleteInterviewRound);
router.get("/by-job/:jobId", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), getInterviewRoundByJobId);
router.get("/:roundId/applicant/:applicantId", validateRoleAndPermissions([Permission.APPLICANT_INTERVIEW_DETAIL]), getRoundByIdAndApplicantId);
router.get("/:roundId", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), getInterviewRoundsById);
router.post("/start", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), validateInterviewRound, manageInterviewRound);
router.patch("/status/:roundId", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), updateRoundStatus);

export const interviewRoundRouter = router;