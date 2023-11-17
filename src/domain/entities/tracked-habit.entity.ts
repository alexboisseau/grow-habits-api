import { Entity } from '../shared/entity';

export const TRACKED_HABIT_STATUS = ['TO_COMPLETE', 'COMPLETED'] as const;
export type TrackedHabitStatus = (typeof TRACKED_HABIT_STATUS)[number];

export type TrackedHabitProps = {
  id: string;
  status: TrackedHabitStatus;
  date: string;
  habitId: string;
  userId: string;
};

export class TrackedHabit extends Entity<TrackedHabitProps> {
  public initialProps: TrackedHabitProps;

  isInTheFuture(currentDate: Date) {
    return new Date(this.props.date) > currentDate;
  }

  isBeforeStartDate(startDate: Date) {
    return new Date(this.props.date) < startDate;
  }
}
