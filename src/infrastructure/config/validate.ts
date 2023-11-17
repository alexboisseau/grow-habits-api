import { configSchema } from './schemas';

export const validate = (config: Record<string, string>) => {
  const validatedConfig = {
    app: {
      port: parseInt(config.PORT),
    },
    bcrypt: {
      saltOrRounds: parseInt(config.BCRYPT_SALT_ROUNDS),
    },
    database: {
      url: config.DATABASE_URL,
    },
    redis: {
      host: config.REDIS_HOST,
      port: parseInt(config.REDIS_PORT),
    },
    session: {
      secret: config.SESSION_SECRET,
      maxAge: parseInt(config.SESSION_MAX_AGE),
    },
  };

  try {
    configSchema.parse(validatedConfig);
  } catch (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return validatedConfig;
};
