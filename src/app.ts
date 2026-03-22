import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from '../routes/users';
import cardsRouter from '../routes/cards';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '69bfd50d6c9e6950f30272e8',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((err: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});

app.listen(port);
