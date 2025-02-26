import express from 'express';
import { createInterviewRound, deleteInterviewRound, getInterviewRoundByJobId, getInterviewRoundsById, manageInterviewRound, updateInterviewRound, updateRoundStatus } from '../controllers/interview-rounds/interview-round';
const router = express.Router();

router.post("/create", createInterviewRound);
router.patch("/:roundId", updateInterviewRound);
router.delete("/", deleteInterviewRound);
router.get("/by-job/:jobId", getInterviewRoundByJobId);
router.get("/:roundId", getInterviewRoundsById);
router.post("/start", manageInterviewRound);
router.patch("/status/:roundId", updateRoundStatus);

export const interviewRoundRouter = router;