import { ConfirmPasswordException } from '../../exceptions/confirm-password';
import { EmailAlreadyUsedException } from '../../exceptions/email-already-used';
import { EmailFormatException } from '../../exceptions/email-format';
import { PasswordLengthException } from '../../exceptions/password-length';

export class HttpUserExceptionsMapper {
  map(error: Error) {
    if (error instanceof ConfirmPasswordException) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }

    if (error instanceof EmailAlreadyUsedException) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }

    if (error instanceof EmailFormatException) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }

    if (error instanceof PasswordLengthException) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }

    return {
      statusCode: 500,
      message: 'Internal Server Error',
    };
  }
}
