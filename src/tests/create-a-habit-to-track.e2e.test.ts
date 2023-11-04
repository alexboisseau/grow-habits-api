import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eUser } from './seeds/user-seeds';

describe('Feature : create a habit to track', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUser.alice]);
  });

  describe('Scenario : happy path', () => {
    it('should create the new habit', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent.post('/login').send({
        email: e2eUser.alice.entity.props.email,
        password: 'Welcome@123',
      });

      const payload = {
        name: 'Brush my teeth',
        cue: 'After my breakfast',
        craving: 'Clean my teeth',
        response: 'Brush my teeth during three minutes',
        reward: 'Have a good feeling with fresh breath',
        userId: 'bob',
      };

      const result = await agent.post('/habits').send(payload);

      expect(result.status).toEqual(201);
    });
  });
});
