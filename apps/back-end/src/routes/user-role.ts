import { Router } from 'express';
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from '../controllers/user-role/user-role';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';

const router = Router();

const commonPermissions = [Permission.ROLE_READ];

router.post('/add', validateRoleAndPermissions([Permission.ROLE_CREATE]), createRole);
router.get('/', validateRoleAndPermissions(commonPermissions), getRoles);
router.get('/:roleId', validateRoleAndPermissions(commonPermissions), getRoleById);
router.patch('/:roleId', validateRoleAndPermissions([Permission.ROLE_UPDATE]), updateRole);
router.delete('/', validateRoleAndPermissions([Permission.ROLE_DELETE]), deleteRole);

export const roleRouter = router;