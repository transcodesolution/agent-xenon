import { Router } from 'express';
import { createUser, deleteUser, getUser, getUserById, getUserDetails, getUserPermissions, updateUser } from '../controllers/user/user';

const router = Router();

router.post('/add', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/', getUserDetails);
router.get('/all', getUser);
router.get('/permissions', getUserPermissions);
router.get('/:id', getUserById);

export const userRouter = router;