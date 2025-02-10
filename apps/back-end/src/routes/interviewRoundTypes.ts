import express from 'express';
import { createInterviewRound, deleteInterviewRound, getInterviewRounds, updateInterviewRound } from '../controllers/interviewRoundTypes/interviewRoundType';

const router = express.Router();

router.post("/create", createInterviewRound);
router.put("/:roundTypeId", updateInterviewRound);
router.delete("/:roundTypeId", deleteInterviewRound);
router.get("/", getInterviewRounds);

export const interviewRoundTypeRouter = router;