type TrackedHabitStatus = 'TO_COMPLETE' | 'COMPLETED';

type TrackedHabitProps = {
  id: string;
  status: TrackedHabitStatus;
  date: string;
  habitId: string;
  userId: string;
};

export class TrackedHabit {
  constructor(public props: TrackedHabitProps) {}
}
