export type HabitProps = {
  id: string;
  name: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
  trackedFrom: Date;
};

export class Habit {
  constructor(public props: HabitProps) {}
}
