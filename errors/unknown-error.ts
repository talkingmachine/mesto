export default class UnknownError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || 'Неизвестная ошибка');
    this.statusCode = 500;
  }
}
