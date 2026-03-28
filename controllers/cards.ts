import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: new Types.ObjectId(req.user._id) })
    .then((card) => res.status(201).send({ card }))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }
    })
    .then(() => Card.findByIdAndDelete(cardId).then((card) => res.send({ card })))
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: new Types.ObjectId(req.user._id) } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ card });
    })
    .catch(next);
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: new Types.ObjectId(req.user._id) } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ card });
    })
    .catch(next);
};
