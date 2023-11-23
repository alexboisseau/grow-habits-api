import { z } from 'zod';
import { TrackedHabitStatus } from '../../../domain/entities/tracked-habit.entity';

export namespace TrackedHabitAPI {
  export namespace GetTrackedHabitsByDateAndUserId {
    const dateQueryParam = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
    export const querySchema = z.object({
      date: dateQueryParam,
    });

    export type Query = z.infer<typeof querySchema>;

    export type Response = Array<{
      id: string;
      date: string;
      status: TrackedHabitStatus;
      habitId: string;
      userId: string;
    }>;
  }

  export namespace GetTrackedHabitsGrid {
    const yearQueryParam = z.string().regex(/^\d{4}$/);
    export const querySchema = z.object({
      year: yearQueryParam,
    });

    export type Query = z.infer<typeof querySchema>;

    export type Response = Array<{
      date: Date;
      completedTrackedHabitsCount: number;
      uncompletedTrackedHabitsCount: number;
      habitsCount: number;
    }>;
  }
}
