import { z } from 'zod';

const bcryptSchema = z.object({
  saltOrRounds: z.coerce.number(),
});

const databaseSchema = z.object({
  url: z.string(),
});

const redisSchema = z.object({
  host: z.string(),
  port: z.coerce.number(),
});

const sessionSchema = z.object({
  secret: z.string(),
  maxAge: z.coerce.number(),
});

export const configSchema = z.object({
  bcrypt: bcryptSchema,
  database: databaseSchema,
  redis: redisSchema,
  session: sessionSchema,
});

export type Config = z.infer<typeof configSchema>;
export type BcryptConfig = z.infer<typeof bcryptSchema>;
export type DatabaseConfig = z.infer<typeof databaseSchema>;
export type RedisConfig = z.infer<typeof redisSchema>;
export type SessionConfig = z.infer<typeof sessionSchema>;
