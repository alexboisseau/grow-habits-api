import { z } from 'zod';

export namespace HabitAPI {
  export namespace CreateAHabitToTrack {
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

  export namespace CompleteHabit {
    export const schema = z.object({
      date: z.string().refine((value) => !isNaN(Date.parse(value))),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }
}
