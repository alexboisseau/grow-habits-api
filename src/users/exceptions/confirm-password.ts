import { BadRequestException } from '@nestjs/common';

export class ConfirmPasswordException extends BadRequestException {
  constructor() {
    super("Password and confirm password fields don't match");
  }
}
