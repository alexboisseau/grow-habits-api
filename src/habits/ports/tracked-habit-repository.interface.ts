import { TrackedHabit } from '../entities/tracked-habit.entity';

export interface ITrackedHabitRepository {
  findByHabitIdAndDate(
    trackedHabitId: string,
    date: string,
  ): Promise<TrackedHabit | null>;

  create(trackedHabit: TrackedHabit): Promise<void>;
  update(trackedHabit: TrackedHabit): Promise<void>;
}
