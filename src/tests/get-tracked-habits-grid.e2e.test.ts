import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seeds';
import { e2eHabits } from './seeds/habit-seeds';

describe('Query : get tracked habits grid', () => {
  async function login(agent: request.SuperAgentTest) {
    await agent.post('/login').send({
      email: e2eUsers.alice.entity.props.email,
      password: 'Welcome@123',
    });
  }

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
    it('should return an HTTP status equals to 200 and a body containing an array', async () => {
      await login(agent);

      const result = await agent.get(
        '/tracked-habits-grid?year=2023&userId=' + aliceId,
      );

      expect(result.status).toEqual(200);
      expect(result.body.length).toBeGreaterThan(0);
    });
  });

  describe('Unhappy path', () => {
    it('should fail if the user is not connected', async () => {
      const result = await request(app.getHttpServer()).get(
        '/tracked-habits-grid?year=2023&userId=' + aliceId,
      );

      expect(result.status).toEqual(403);
    });

    it('should fail if the user connected request another user tracked habits grid', async () => {
      await login(agent);
      const result = await request(app.getHttpServer()).get(
        '/tracked-habits-grid?year=2023&userId=' + bobId,
      );

      expect(result.status).toEqual(403);
    });
  });
});