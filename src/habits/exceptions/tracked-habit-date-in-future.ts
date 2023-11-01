import { BadRequestException } from '@nestjs/common';

export class TrackedHabitDateInFutureException extends BadRequestException {
  constructor() {
    super('Tracked habit date cannot be in the future');
  }
}
