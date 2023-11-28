import { z } from 'zod';
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
  HabitProps,
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

    export const headersSchema = z.object({
      'x-timezone': z
        .string()
        .refine((timezone) =>
          Intl.supportedValuesOf('timeZone').includes(timezone),
        ),
    });

    export type RequestHeaders = z.infer<typeof headersSchema>;
    export type Request = z.infer<typeof schema>;
    export type Response = HabitProps;
  }
}
