import { DomainException } from '../../../../domain/shared/exception';

export class CompletionDateBeforeHabitsStartDateException extends DomainException {
  constructor() {
    super("Completion date must be after the habit's start date.");
  }
}
