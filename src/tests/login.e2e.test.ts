import { e2eUsers } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import * as request from 'supertest';

describe('Feature: login', () => {
  async function login(agent: request.SuperAgentTest, payload: any) {
    return await agent.post('/login').send(payload);
  }

  let app: TestApp;
  let agent: request.SuperAgentTest;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.alice]);
    agent = request.agent(app.getHttpServer());
  });

  describe('Happy path', () => {
    it('should logged in', async () => {
      const payload = {
        email: e2eUsers.alice.entity.props.email,
        password: 'Welcome@123',
      };

      const result = await login(agent, payload);

      expect(result.status).toEqual(201);
      expect(result.header['set-cookie']).toBeDefined();
    });
  });

  describe('Unhappy path', () => {
    it('should fail with wrong credentials', async () => {
      const payload = {
        email: 'fake-email',
        password: 'fake-password',
      };

      const result = await login(agent, payload);

      expect(result.status).toEqual(401);
      expect(result.header['set-cookie']).toBeUndefined();
    });
  });
});
