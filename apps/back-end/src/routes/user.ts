import { Router } from 'express';
import { getUserDetails, getUserPermissions } from '../controllers/user/user';

const router = Router();

router.get('/', getUserDetails);
router.get('/permissions', getUserPermissions);

export const userRouter = router;