import express from 'express';
import { createQuestionAnswer, deleteQuestionAnswer, getAllQuestionList, getQuestions, updateQuestionAnswer } from '../controllers/question-answers/interview-question-answer';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.QUESTION_ANSWER_CREATE]), createQuestionAnswer);
router.put("/:questionId", validateRoleAndPermissions([Permission.QUESTION_ANSWER_UPDATE]), updateQuestionAnswer);
router.delete("/:questionId", validateRoleAndPermissions([Permission.QUESTION_ANSWER_DELETE]), deleteQuestionAnswer);
router.get("/", validateRoleAndPermissions([Permission.QUESTION_ANSWER_READ]), getQuestions);
router.get("/all", validateRoleAndPermissions([Permission.QUESTION_ANSWER_READ]), getAllQuestionList);

export const interviewQuestionAnswerRouter = router;