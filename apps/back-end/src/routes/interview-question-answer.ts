import express from 'express';
import { createQuestionAnswer, deleteQuestionAnswer, getAllQuestionList, getQuestions, updateQuestionAnswer } from '../controllers/question-answers/interview-question-answer';
const router = express.Router();

router.post("/create", createQuestionAnswer);
router.put("/:questionId", updateQuestionAnswer);
router.delete("/:questionId", deleteQuestionAnswer);
router.get("/", getQuestions);
router.get("/all", getAllQuestionList);

export const interviewQuestionAnswerRouter = router;