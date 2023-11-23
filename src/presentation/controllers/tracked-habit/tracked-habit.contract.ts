import { z } from 'zod';
import { TrackedHabitStatus } from '../../../domain/entities/tracked-habit.entity';

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
}
