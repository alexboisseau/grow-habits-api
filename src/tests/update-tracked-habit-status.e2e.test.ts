import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eHabits } from './seeds/habit-seeds';
import { e2eUsers } from './seeds/user-seeds';
import { TrackedHabitStatus } from '@prisma/client';
import {
  ITrackedHabitRepository,
  I_TRACKED_HABIT_REPOSITORY,
} from '../domain/ports/tracked-habit-repository.port';
import { TrackedHabit } from '../domain/entities/tracked-habit.entity';
import { LoginParams, login } from './utils/login';

describe('Feature: update tracked habit status', () => {
  let app: TestApp;
  let agent: request.SuperAgentTest;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.alice, e2eHabits.makeMyBed]);
    agent = request.agent(app.getHttpServer());
    agent.set('x-timezone', 'Europe/Paris');
  });

  afterEach(async () => {
    await app.cleanUp();
  });

  const payload = {
    date: '2023-01-03',
    status: TrackedHabitStatus.COMPLETED,
    habitId: 'id-1',
  };

  describe('Happy path', () => {
    it('should complete the tracked habit', async () => {
      const loginParams: LoginParams = {
        agent,
        email: e2eUsers.alice.entity.props.email,
        password: 'Welcome@123',
      };
      await login(loginParams);

      const result = await agent
        .put('/tracked-habits/update-status')
        .send(payload);

      expect(result.status).toEqual(200);

      const trackedHabitRepository = app.get<ITrackedHabitRepository>(
        I_TRACKED_HABIT_REPOSITORY,
      );

      const completedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
        'id-1',
        payload.date,
      )) as TrackedHabit;

      expect(completedHabit.props.status).toEqual('COMPLETED');
    });

    it('should cancel completion of the tracked habit', async () => {
      const loginParams: LoginParams = {
        agent,
        email: e2eUsers.alice.entity.props.email,
        password: 'Welcome@123',
      };
      await login(loginParams);

      const result = await agent
        .put('/tracked-habits/update-status')
        .send({ ...payload, status: TrackedHabitStatus.TO_COMPLETE });

      expect(result.status).toEqual(200);

      const trackedHabitRepository = app.get<ITrackedHabitRepository>(
        I_TRACKED_HABIT_REPOSITORY,
      );

      const completedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
        'id-1',
        payload.date,
      )) as TrackedHabit;

      expect(completedHabit.props.status).toEqual('TO_COMPLETE');
    });
  });

  describe('Unhappy path', () => {
    it('should fail if user is not connected', async () => {
      const result = await agent
        .put('/tracked-habits/update-status')
        .send(payload);

      expect(result.status).toEqual(401);
    });
  });
});
