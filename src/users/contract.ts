import { z } from 'zod';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from './entities/user.entity';

export namespace UserAPI {
  export namespace Register {
    export const schema = z.object({
      email: z.string().max(USER_EMAIL_MAX_LENGTH),
      password: z
        .string()
        .min(USER_PASSWORD_MIN_LENGTH)
        .max(USER_PASSWORD_MAX_LENGTH),
      confirmPassword: z
        .string()
        .min(USER_PASSWORD_MIN_LENGTH)
        .max(USER_PASSWORD_MAX_LENGTH),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }
}
