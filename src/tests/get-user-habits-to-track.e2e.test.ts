import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seeds';
import { e2eHabits } from './seeds/habit-seeds';
import { LoginParams, login } from './utils/login';

describe('Query : get user habits to track', () => {
  let app: TestApp;
  let agent: request.SuperAgentTest;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.alice, e2eHabits.makeMyBed]);
    agent = request.agent(app.getHttpServer());
  });

  afterEach(async () => {
    await app.cleanUp();
  });

  const aliceId = e2eUsers.alice.entity.props.id;
  const bobId = e2eUsers.bob.entity.props.id;

  describe('Happy path', () => {
    it('should return a tracked habit with empty id', async () => {
      const loginParams: LoginParams = {
        agent,
        email: e2eUsers.alice.entity.props.email,
        password: 'Welcome@123',
      };
      await login(loginParams);

      const result = await agent.get(
        '/tracked-habits/?date=2023-01-01&userId=' + aliceId,
      );

      expect(result.status).toEqual(200);
      expect(result.body[0]).toEqual({
        id: '',
        date: '2023-01-01',
        status: 'TO_COMPLETE',
        habitId: 'id-1',
        userId: 'id-1',
      });
    });
  });

  describe('Unhappy path', () => {
    it('should fail if user is not connected', async () => {
      const result = await request(app.getHttpServer()).get(
        '/tracked-habits/?date=2023-01-01&userId=' + aliceId,
      );

      expect(result.status).toEqual(403);
    });

    it('should fail if user connected request another user habits', async () => {
      const result = await request(app.getHttpServer()).get(
        '/tracked-habits/?date=2023-01-01&userId=' + bobId,
      );

      expect(result.status).toEqual(403);
    });
  });
});
