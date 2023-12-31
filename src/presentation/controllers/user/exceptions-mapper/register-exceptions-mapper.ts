import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfirmPasswordException } from '../../../../application/usecases/register/exceptions/confirm-password.exception';
import { EmailAlreadyUsedException } from '../../../../application/usecases/register/exceptions/email-already-used.exception';
import { EmailFormatException } from '../../../../application/usecases/register/exceptions/email-format.exception';
import { PasswordLengthException } from '../../../../application/usecases/register/exceptions/password-length.exception';
import { ExceptionsMapper } from '../../../shared/exceptions-mapper';

export class RegisterExceptionsMapper extends ExceptionsMapper {
  map(error: Error) {
    if (error instanceof ConfirmPasswordException) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    if (error instanceof EmailAlreadyUsedException) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    if (error instanceof EmailFormatException) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    if (error instanceof PasswordLengthException) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return this.defaultException;
  }
}
