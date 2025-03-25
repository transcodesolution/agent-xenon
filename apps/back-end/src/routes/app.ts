import { Router } from 'express';
import { connectApp, disconnectApp, getApp } from '../controllers/app/app';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';

const router = Router();

router.post('/connect', validateRoleAndPermissions([Permission.CONNECT_APP]), connectApp);
router.post('/disconnect', validateRoleAndPermissions([Permission.DISCONNECT_APP]), disconnectApp);
router.get('/', validateRoleAndPermissions([Permission.READ_APP_INFO]), getApp);

export const appRouter = router;