export class CompletionDateBeforeHabitsStartDateException extends Error {
  constructor() {
    super("Completion date must be after the habit's start date.");
  }
}
