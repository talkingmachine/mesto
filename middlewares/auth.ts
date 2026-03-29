import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  let payload;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    payload = jwt.verify(token, 'some-secret-key') as { _id: string };
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
