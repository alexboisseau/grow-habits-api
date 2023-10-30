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
}
