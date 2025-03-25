import express from 'express';
import { createQuestionAnswer, deleteQuestionAnswer, getAllQuestionList, getQuestionById, getQuestions, updateQuestionAnswer } from '../controllers/question-answers/interview-question';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.QUESTION_ANSWER_CREATE]), createQuestionAnswer);
router.put("/:questionId", validateRoleAndPermissions([Permission.QUESTION_ANSWER_UPDATE]), updateQuestionAnswer);
router.delete("/", validateRoleAndPermissions([Permission.QUESTION_ANSWER_DELETE]), deleteQuestionAnswer);
router.get("/", validateRoleAndPermissions([Permission.QUESTION_ANSWER_READ]), getQuestions);
router.get("/all", validateRoleAndPermissions([Permission.QUESTION_ANSWER_READ]), getAllQuestionList);
router.get("/:questionId", validateRoleAndPermissions([Permission.QUESTION_ANSWER_READ]), getQuestionById);

export const interviewQuestionAnswerRouter = router;