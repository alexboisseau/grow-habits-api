export type HabitProps = {
  id: string;
  name: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
  trackedFrom: Date;
  userId: string;
};

export class Habit {
  constructor(public props: HabitProps) {}
}
