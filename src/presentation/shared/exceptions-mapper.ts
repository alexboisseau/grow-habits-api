import { HttpException, HttpStatus } from '@nestjs/common';

export interface IExceptionsMapper {
  map(error: Error): Error;
}

export class ExceptionsMapper {
  protected readonly defaultException = new HttpException(
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  map(error: Error) {
    return this.defaultException;
  }
}
