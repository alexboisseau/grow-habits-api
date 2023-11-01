export class HabitNotFoundException extends Error {
  constructor() {
    super('Habit not found');
  }
}
