import { DomainException } from '../../../../domain/shared/exception';

export class TrackedHabitDateInFutureException extends DomainException {
  constructor() {
    super('Tracked habit date cannot be in the future');
  }
}
