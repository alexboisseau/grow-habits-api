import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../core/app.module';
import { IFixture } from '../fixtures/fixture.interface';

import * as session from 'express-session';
import * as passport from 'passport';

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication();

    this.app.use(
      session({
        secret: 'GFxlDDu25cdHqLbnxEXxqMnTtgs6eVQdRYUIjyMrYX4=',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 3600000,
        },
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    await this.app.init();
  }

  async cleanUp() {
    await this.app.close();
  }

  get<T>(name: any) {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  async loadFixtures(fixtures: IFixture[]) {
    return await Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }
}
