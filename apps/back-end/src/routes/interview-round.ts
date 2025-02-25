import express from 'express';
import { createInterviewRound, deleteInterviewRound, getInterviewRoundByJobId, getInterviewRoundQuestions, getInterviewRoundsById, manageInterviewRound, updateInterviewRound } from '../controllers/interview-rounds/interview-round';
const router = express.Router();

router.post("/create", createInterviewRound);
router.patch("/:roundId", updateInterviewRound);
router.delete("/", deleteInterviewRound);
router.get("/questions", getInterviewRoundQuestions);
router.get("/by-job/:jobId", getInterviewRoundByJobId);
router.get("/:roundId", getInterviewRoundsById);
router.post("/start", manageInterviewRound);

export const interviewRoundRouter = router;