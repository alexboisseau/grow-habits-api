import { z } from 'zod';
import { TrackedHabitStatus } from '../../../domain/entities/tracked-habit.entity';

export namespace TrackedHabitAPI {
  export namespace GetTrackedHabitsByDateAndUserId {
    export const dateQuery = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
    export const userIdQuery = z.string();

    export const querySchema = z.object({
      date: dateQuery,
    });

    export type Response = Array<{
      id: string;
      date: string;
      status: TrackedHabitStatus;
      habitId: string;
      userId: string;
    }>;
  }

  export namespace GetTrackedHabitsGrid {
    export const userIdQueryParam = z.string();
    export const yearQueryParam = z.string().regex(/^\d{4}$/);

    export type Response = Array<{
      date: Date;
      completedTrackedHabitsCount: number;
      uncompletedTrackedHabitsCount: number;
      habitsCount: number;
    }>;
  }
}
