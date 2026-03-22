type TMessage = 'Запрашиваемый пользователь не найден' | 'Запрашиваемая карточка не найдена';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: TMessage) {
    super(message);
    this.statusCode = 404;
  }
}
