import express from 'express';
import { createInterviewRound, deleteInterviewRound, getInterviewRoundByJobId, getInterviewRoundsById, manageInterviewRound, updateInterviewRound, updateRoundStatus } from '../controllers/interview-rounds/interview-round';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.INTERVIEW_ROUND_CREATE]), createInterviewRound);
router.patch("/:roundId", validateRoleAndPermissions([Permission.INTERVIEW_ROUND_UPDATE]), updateInterviewRound);
router.delete("/", validateRoleAndPermissions([Permission.INTERVIEW_ROUND_DELETE]), deleteInterviewRound);
router.get("/by-job/:jobId", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), getInterviewRoundByJobId);
router.get("/:roundId", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), getInterviewRoundsById);
router.post("/start", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), manageInterviewRound);
router.patch("/status/:roundId", validateRoleAndPermissions([Permission.JOB_ROUNDS_TAB]), updateRoundStatus);

export const interviewRoundRouter = router;