import { NestFactory } from '@nestjs/core';

import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { AppModule } from './infrastructure/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig, SessionConfig } from './infrastructure/config/schemas';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const appConfig = config.get('app') as AppConfig;
  const sessionConfig = config.get('session') as SessionConfig;

  const redisClient = createClient();
  redisClient
    .connect()
    .catch((err) => console.error('Redis Client Error :', err));

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
  });

  app.use(
    session({
      store: redisStore,
      secret: sessionConfig.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: sessionConfig.maxAge,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(appConfig.port);
  console.log(`Application is running on port ${appConfig.port} 🚀`);
}
bootstrap();
