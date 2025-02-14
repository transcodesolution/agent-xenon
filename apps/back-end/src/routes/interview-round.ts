import express from 'express';
import { createInterviewRound, deleteInterviewRound, getInterviewRoundQuestions, manageInterviewRound, updateInterviewRound } from '../controllers/interview-rounds/interview-round';
const router = express.Router();

router.post("/create", createInterviewRound);
router.patch("/:roundId", updateInterviewRound);
router.delete("/", deleteInterviewRound);
router.get("/questions", getInterviewRoundQuestions);
router.post("/start", manageInterviewRound);

export const interviewRoundRouter = router;