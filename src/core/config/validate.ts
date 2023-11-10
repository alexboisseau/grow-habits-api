import { configSchema } from './schemas';

export const validate = (config: Record<string, string>) => {
  const validatedConfig = {
    bcrypt: {
      saltOrRounds: config.BCRYPT_SALT_ROUNDS,
    },
    database: {
      url: config.DATABASE_URL,
    },
    redis: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
    session: {
      secret: config.SESSION_SECRET,
      maxAge: config.SESSION_MAX_AGE,
    },
  };

  try {
    configSchema.parse(validatedConfig);
  } catch (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return validatedConfig;
};
