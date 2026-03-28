import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  jwt.verify(jwt, 'some-secret-key').then((payload: { _id: string }) => {
    req.user = payload;
    next();
  }).catch(() => {
    throw new UnauthorizedError('Необходима авторизация');
  });
};
