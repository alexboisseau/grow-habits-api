import { z } from 'zod';

export namespace UserAPI {
  export namespace Register {
    export const schema = z.object({
      email: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }
}
