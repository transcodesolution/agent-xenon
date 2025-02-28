import express from 'express';
import { getExamQuestions, submitExam } from '../controllers/interview-rounds/interview-round';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';

const router = express.Router();

router.use(validateRoleAndPermissions([
    Permission.EXAM_PAGE
]));

router.post("/submit", submitExam);
router.get("/questions", getExamQuestions);

export const technicalRoundRouter = router;