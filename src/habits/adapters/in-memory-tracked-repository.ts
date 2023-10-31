import { TrackedHabit } from '../entities/tracked-habit.entity';
import { ITrackedHabitRepository } from '../ports/tracked-habit-repository.interface';

export class InMemoryTrackedHabitRepository implements ITrackedHabitRepository {
  constructor(private database: TrackedHabit[] = []) {}

  async create(trackedHabit: TrackedHabit): Promise<void> {
    this.database.push(trackedHabit);
  }

  async findByHabitIdAndDate(
    trackedHabitId: string,
    date: string,
  ): Promise<TrackedHabit | null> {
    const trackedHabitIndex = this.database.findIndex(
      (trackedHabit) =>
        trackedHabit.props.habitId === trackedHabitId &&
        trackedHabit.props.date === date,
    );

    if (trackedHabitIndex < 0) return null;

    return new TrackedHabit({ ...this.database[trackedHabitIndex].props });
  }
}
