import { Router } from 'express';
import {
  createUser, getUser, getUsers, updateSelf, updateSelfAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateSelf);
router.patch('/me/avatar', updateSelfAvatar);

export default router;
