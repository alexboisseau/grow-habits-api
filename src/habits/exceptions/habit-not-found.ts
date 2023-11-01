import { NotFoundException } from '@nestjs/common';

export class HabitNotFoundException extends NotFoundException {
  constructor() {
    super('Habit not found');
  }
}
