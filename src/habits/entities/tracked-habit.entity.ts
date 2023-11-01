export type TrackedHabitStatus = 'TO_COMPLETE' | 'COMPLETED';

export type TrackedHabitProps = {
  id: string;
  status: TrackedHabitStatus;
  date: string;
  habitId: string;
  userId: string;
};

export class TrackedHabit {
  public initialProps: TrackedHabitProps;

  constructor(public props: TrackedHabitProps) {
    this.initialProps = { ...this.props };
  }

  isInTheFuture(currentDate: Date) {
    return new Date(this.props.date) > currentDate;
  }

  update(data: Partial<TrackedHabitProps>) {
    this.props = {
      ...this.props,
      ...data,
    };
  }

  commit() {
    this.initialProps = { ...this.props };
  }
}
