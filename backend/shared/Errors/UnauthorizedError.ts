export class UnauthorizedError extends Error {
  public readonly statusCode = 401;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    Error.captureStackTrace(this, this.constructor);
  }
}
