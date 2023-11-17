import { z } from 'zod';
import { TRACKED_HABIT_STATUS } from '../../../domain/entities/tracked-habit.entity';
import {
  HABIT_CRAVING_MAX_LENGTH,
  HABIT_CRAVING_MIN_LENGTH,
  HABIT_CUE_MAX_LENGTH,
  HABIT_CUE_MIN_LENGTH,
  HABIT_NAME_MAX_LENGTH,
  HABIT_NAME_MIN_LENGTH,
  HABIT_RESPONSE_MAX_LENGTH,
  HABIT_RESPONSE_MIN_LENGTH,
  HABIT_REWARD_MAX_LENGTH,
  HABIT_REWARD_MIN_LENGTH,
} from '../../../domain/entities/habit.entity';

export namespace HabitAPI {
  export namespace CreateHabitToTrack {
    export const schema = z.object({
      name: z.string().min(HABIT_NAME_MIN_LENGTH).max(HABIT_NAME_MAX_LENGTH),
      cue: z.string().min(HABIT_CUE_MIN_LENGTH).max(HABIT_CUE_MAX_LENGTH),
      craving: z
        .string()
        .min(HABIT_CRAVING_MIN_LENGTH)
        .max(HABIT_CRAVING_MAX_LENGTH),
      response: z
        .string()
        .min(HABIT_RESPONSE_MIN_LENGTH)
        .max(HABIT_RESPONSE_MAX_LENGTH),
      reward: z
        .string()
        .min(HABIT_REWARD_MIN_LENGTH)
        .max(HABIT_REWARD_MAX_LENGTH),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }

  export namespace UpdateTrackedHabitStatus {
    export const schema = z.object({
      date: z.string().refine((value) => !isNaN(Date.parse(value))),
      status: z.enum(TRACKED_HABIT_STATUS),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }
}
