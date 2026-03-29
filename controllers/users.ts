import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictError from '../errors/conflict-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ users }))
  .catch(next);

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ user });
    })
    .catch(next);
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })).then((user) => {
    res.status(201).send({
      ...user.toObject(),
      password: '********',
    });
  })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

export const updateSelf = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ user });
    })
    .catch(next);
};

export const updateSelfAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ user });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильный email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильный email или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
            expiresIn: '7d',
          });
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3600000 * 24 * 7,
            sameSite: 'strict',
          });
          res.send({ message: 'Авторизация успешна' });
        });
    })
    .catch(next);
};
