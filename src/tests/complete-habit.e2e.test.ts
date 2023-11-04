import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eHabit } from './seeds/habit-seeds';
import {
  ITrackedHabitRepository,
  I_TRACKED_HABIT_REPOSITORY,
} from '../habits/ports/tracked-habit-repository.interface';
import { TrackedHabit } from '../habits/entities/tracked-habit.entity';
import { e2eUser } from './seeds/user-seeds';

describe('Feature: completing a habit', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eHabit.makeMyBed, e2eUser.alice]);
  });

  describe('Happy path', () => {
    it('should complete the tracked habit', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent.post('/login').send({
        email: e2eUser.alice.entity.props.email,
        password: 'Welcome@123',
      });

      const payload = {
        date: '2023-01-03',
      };

      const result = await agent.post('/habits/id-1/complete').send(payload);

      expect(result.status).toEqual(201);

      const trackedHabitRepository = app.get<ITrackedHabitRepository>(
        I_TRACKED_HABIT_REPOSITORY,
      );

      const completedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
        'id-1',
        '2023-01-03',
      )) as TrackedHabit;

      expect(completedHabit.props.status).toEqual('COMPLETED');
    });
  });

  describe('Unhappy path', () => {
    it('should fail if user is not connected', async () => {
      const payload = {
        date: '2023-01-03',
      };

      const result = await request(app.getHttpServer())
        .post('/habits/id-1/complete')
        .send(payload);

      expect(result.status).toEqual(403);
    });
  });
});
