import { Router } from 'express';
import { createUser, deleteUser, getUser, getUserById, getUserDetails, getUserPermissions, updateUser } from '../controllers/user/user';
import { Permission } from '@agent-xenon/constants';
import { validateRoleAndPermissions } from '../helper/middleware';

const router = Router();

router.post('/add', validateRoleAndPermissions([Permission.USER_CREATE]), createUser);
router.patch('/:id', validateRoleAndPermissions([Permission.USER_UPDATE]), updateUser);
router.delete('/', validateRoleAndPermissions([Permission.USER_DELETE]), deleteUser);
router.get('/', getUserDetails);
router.get('/all', validateRoleAndPermissions([Permission.USER_READ]), getUser);
router.get('/permissions', getUserPermissions);
router.get('/:id', validateRoleAndPermissions([Permission.USER_READ]), getUserById);

export const userRouter = router;