import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seeds';

describe('Feature : create habit to track', () => {
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
    await app.loadFixtures([e2eUsers.alice]);
    agent = request.agent(app.getHttpServer());
  });

  afterEach(async () => {
    await app.cleanUp();
  });

  const payload = {
    name: 'Brush my teeth',
    cue: 'After my breakfast',
    craving: 'Clean my teeth',
    response: 'Brush my teeth during three minutes',
    reward: 'Have a good feeling with fresh breath',
  };

  describe('Happy path', () => {
    it('should create the new habit', async () => {
      await login(agent);

      const result = await agent.post('/habits').send(payload);

      expect(result.status).toEqual(201);
    });
  });

  describe('Unhappy path', () => {
    it('should fail if user is not connected', async () => {
      const result = await request(app.getHttpServer())
        .post('/habits')
        .send(payload);

      expect(result.status).toEqual(403);
    });
  });
});
