import { BadRequestException } from '@nestjs/common';

export class CompletionDateBeforeHabitsStartDateException extends BadRequestException {
  constructor() {
    super("Completion date must be after the habit's start date.");
  }
}
