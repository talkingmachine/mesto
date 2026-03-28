import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser, getMe, getUser, getUsers, updateSelf, updateSelfAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUser, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}));
router.post('/', createUser, celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(200),
    avatar: Joi.string().optional().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}));
router.patch('/me', updateSelf, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}));
router.patch('/me/avatar', updateSelfAvatar, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}));

export default router;
