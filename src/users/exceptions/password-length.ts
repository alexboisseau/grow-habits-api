import { BadRequestException } from '@nestjs/common';

export class PasswordLengthException extends BadRequestException {
  constructor() {
    super('Password length must be greater than or equal to 8');
  }
}
