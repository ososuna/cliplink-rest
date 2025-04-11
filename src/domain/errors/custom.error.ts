import { Messages } from '@/config';

export class CustomError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message);
  }

  static badRequest(message: string): CustomError {
    return new CustomError(400, message);
  }

  static unauthorized(message: string): CustomError {
    return new CustomError(401, message);
  }

  static forbidden(message: string): CustomError {
    return new CustomError(403, message);
  }

  static notFound(message: string): CustomError {
    return new CustomError(404, message);
  }

  static internalServer(message: string = Messages.INTERNAL_SERVER_ERROR): CustomError {
    return new CustomError(500, message);
  }
}
