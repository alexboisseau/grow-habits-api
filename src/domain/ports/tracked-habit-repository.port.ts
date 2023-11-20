import { Habit } from '../entities/habit.entity';
import { TrackedHabit } from '../entities/tracked-habit.entity';

export const I_TRACKED_HABIT_REPOSITORY = 'I_TRACKED_HABIT_REPOSITORY';
export interface ITrackedHabitRepository {
  findByHabitIdAndDate(
    trackedHabitId: string,
    date: string,
  ): Promise<TrackedHabit | null>;
  findAllByHabitsAndDate(
    habits: Habit[],
    date: string,
  ): Promise<TrackedHabit[]>;

  create(trackedHabit: TrackedHabit): Promise<void>;
  update(trackedHabit: TrackedHabit): Promise<void>;
}
