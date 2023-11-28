import { z } from 'zod';
import {
  TRACKED_HABIT_STATUS,
  TrackedHabitStatus,
} from '../../../domain/entities/tracked-habit.entity';

export namespace TrackedHabitAPI {
  export namespace GetTrackedHabitsByDateAndUserId {
    export const requestSchema = z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    });

    export type Request = z.infer<typeof requestSchema>;

    export type Response = Array<{
      id: string;
      date: string;
      status: TrackedHabitStatus;
      habitId: string;
      userId: string;
    }>;
  }

  export namespace GetTrackedHabitsGrid {
    export const requestSchema = z.object({
      year: z.string().regex(/^\d{4}$/),
    });

    export type Request = z.infer<typeof requestSchema>;

    export type Response = Array<{
      date: Date;
      completedTrackedHabitsCount: number;
      uncompletedTrackedHabitsCount: number;
      habitsCount: number;
    }>;
  }

  export namespace UpdateTrackedHabitStatus {
    export const schema = z.object({
      date: z.string().refine((value) => !isNaN(Date.parse(value))),
      status: z.enum(TRACKED_HABIT_STATUS),
      habitId: z.string(),
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
    export type Response = void;
  }
}
