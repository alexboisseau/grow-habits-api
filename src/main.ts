import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';

import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
      secret: 'GFxlDDu25cdHqLbnxEXxqMnTtgs6eVQdRYUIjyMrYX4=',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
