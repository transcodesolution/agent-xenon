import { Router } from 'express';
import { connectApp, disconnectApp, getApp } from '../controllers/app/app';

const router = Router();

router.post('/connect', connectApp);
router.post('/disconnect', disconnectApp);
router.get('/', getApp);

export const appRouter = router;