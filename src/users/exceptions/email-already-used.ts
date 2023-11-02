import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyUsedException extends BadRequestException {
  constructor() {
    super('Email already used');
  }
}
