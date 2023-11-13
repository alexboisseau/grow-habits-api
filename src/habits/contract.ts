import { z } from 'zod';
import { TrackedHabitStatusArray } from './entities/tracked-habit.entity';

export namespace HabitAPI {
  export namespace CreateHabitToTrack {
    export const schema = z.object({
      name: z.string(),
      cue: z.string(),
      craving: z.string(),
      response: z.string(),
      reward: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }

  export namespace UpdateTrackedHabitStatus {
    export const schema = z.object({
      date: z.string().refine((value) => !isNaN(Date.parse(value))),
      status: z.enum(TrackedHabitStatusArray),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }
}
