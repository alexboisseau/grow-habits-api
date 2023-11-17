import { TrackedHabit } from '../../../../../domain/entities/tracked-habit.entity';
import { ITrackedHabitRepository } from '../../../../../domain/ports/tracked-habit-repository.port';

export class InMemoryTrackedHabitRepository implements ITrackedHabitRepository {
  constructor(private database: TrackedHabit[] = []) {}

  async create(trackedHabit: TrackedHabit): Promise<void> {
    this.database.push(trackedHabit);
  }

  async findByHabitIdAndDate(
    habitId: string,
    date: string,
  ): Promise<TrackedHabit | null> {
    const trackedHabitIndex = this.database.findIndex(
      (trackedHabit) =>
        trackedHabit.props.habitId === habitId &&
        trackedHabit.props.date === date,
    );

    if (trackedHabitIndex < 0) return null;

    return new TrackedHabit({ ...this.database[trackedHabitIndex].props });
  }

  async update(trackedHabit: TrackedHabit) {
    const trackedHabitIndex = this.database.findIndex(
      (_trackedHabit) =>
        _trackedHabit.props.habitId === trackedHabit.props.habitId &&
        _trackedHabit.props.date === trackedHabit.props.date,
    );

    if (trackedHabitIndex < 0) return;

    this.database[trackedHabitIndex] = trackedHabit;
    trackedHabit.commit();
  }

  count(): number {
    return this.database.length;
  }
}
