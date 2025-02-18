import express from 'express';
import { getExamQuestions, submitExam } from '../controllers/interview-rounds/interview-round';
const router = express.Router();

router.post("/submit", submitExam);
router.get("/questions", getExamQuestions);

export const technicalRoundRouter = router;