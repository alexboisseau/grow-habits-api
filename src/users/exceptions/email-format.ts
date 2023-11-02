import { BadRequestException } from '@nestjs/common';

export class EmailFormatException extends BadRequestException {
  constructor() {
    super('Invalid email format');
  }
}
