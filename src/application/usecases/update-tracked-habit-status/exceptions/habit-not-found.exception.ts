import { DomainException } from '../../../../domain/shared/exception';

export class HabitNotFoundException extends DomainException {
  constructor() {
    super('Habit not found');
  }
}
