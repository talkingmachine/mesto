import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { celebrate, Joi, errors } from 'celebrate';
import mongoose, { Error as MongooseError } from 'mongoose';
import usersRouter from '../routes/users';
import cardsRouter from '../routes/cards';
import { createUser, login } from '../controllers/users';
import auth from '../middlewares/auth';
import { requestLogger, errorLogger } from '../middlewares/logger';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(200),
    avatar: Joi.string().optional().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);
app.use(errors()); // celebrate error handler

app.use(
  (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (err instanceof MongooseError.ValidationError || err instanceof MongooseError.CastError) {
      res.status(400).send({ message: err.message });
      return;
    }
    res.status(err.statusCode || 500).send({ message: err.message });

    next();
  },
);

app.listen(port);
