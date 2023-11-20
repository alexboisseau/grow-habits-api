import { TrackedHabit } from '../entities/tracked-habit.entity';

export interface IGetUserHabitsToTrackQuery {
  execute(request: { date: string; userId: string }): Promise<TrackedHabit[]>;
}
