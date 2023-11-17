import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../infrastructure/modules/app.module';
import {
  PRISMA_SERVICE,
  PrismaService,
} from '../../infrastructure/persistence/prisma/prisma.service';
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
    await this.clearDatabase();
  }

  get<T>(name: any) {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  async loadFixtures(fixtures: IFixture[]) {
    const loadFixtureSequentially = async (
      accumulator: Promise<void>,
      fixture: IFixture,
    ) => {
      await accumulator;
      return fixture.load(this);
    };

    return fixtures.reduce(loadFixtureSequentially, Promise.resolve());
  }

  private async clearDatabase() {
    const prisma = this.app.get<PrismaService>(PRISMA_SERVICE);
    await prisma.trackedHabit.deleteMany({});
    await prisma.habit.deleteMany({});
    await prisma.user.deleteMany({});
  }
}
