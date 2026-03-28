import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}));
router.delete('/:cardId', deleteCard, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}));
router.put('/:cardId/likes', likeCard, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}));
router.delete('/:cardId/likes', dislikeCard, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}));

export default router;
