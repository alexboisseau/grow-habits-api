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

export const HABIT_NAME_MIN_LENGTH = 3;
export const HABIT_NAME_MAX_LENGTH = 50;
export const HABIT_CUE_MIN_LENGTH = 3;
export const HABIT_CUE_MAX_LENGTH = 255;
export const HABIT_CRAVING_MIN_LENGTH = 3;
export const HABIT_CRAVING_MAX_LENGTH = 255;
export const HABIT_RESPONSE_MIN_LENGTH = 3;
export const HABIT_RESPONSE_MAX_LENGTH = 255;
export const HABIT_REWARD_MIN_LENGTH = 3;
export const HABIT_REWARD_MAX_LENGTH = 255;
