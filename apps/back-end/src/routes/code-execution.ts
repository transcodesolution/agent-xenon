import express from 'express';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
import { executeCode } from '../controllers/code-execution/code-execution';

const router = express.Router();

router.use(validateRoleAndPermissions([Permission.EXAM_PAGE]));
router.post("/execute", executeCode);

export const codeExecuteRouter = router;