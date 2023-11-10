import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfirmPasswordException } from '../../exceptions/confirm-password';
import { EmailAlreadyUsedException } from '../../exceptions/email-already-used';
import { EmailFormatException } from '../../exceptions/email-format';
import { PasswordLengthException } from '../../exceptions/password-length';

export class HttpUserExceptionsMapper {
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

    return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
