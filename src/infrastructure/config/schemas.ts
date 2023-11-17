import { z } from 'zod';

const appSchema = z.object({
  port: z.number(),
});

const bcryptSchema = z.object({
  saltOrRounds: z.number(),
});

const databaseSchema = z.object({
  url: z.string(),
});

const redisSchema = z.object({
  host: z.string(),
  port: z.number(),
});

const sessionSchema = z.object({
  secret: z.string(),
  maxAge: z.number(),
});

export const configSchema = z.object({
  app: appSchema,
  bcrypt: bcryptSchema,
  database: databaseSchema,
  redis: redisSchema,
  session: sessionSchema,
});

export type Config = z.infer<typeof configSchema>;
export type AppConfig = z.infer<typeof appSchema>;
export type BcryptConfig = z.infer<typeof bcryptSchema>;
export type DatabaseConfig = z.infer<typeof databaseSchema>;
export type RedisConfig = z.infer<typeof redisSchema>;
export type SessionConfig = z.infer<typeof sessionSchema>;
