export class TrackedHabitDateInFutureException extends Error {
  constructor() {
    super('Tracked habit date cannot be in the future');
  }
}
