import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser, getMe, getUser, getUsers, updateSelf, updateSelfAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUser);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(200),
    avatar: Joi.string().optional().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateSelf);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateSelfAvatar);

export default router;
