import { e2eUser } from './seeds/user-seeds';
import { TestApp } from './utils/test-app';
import * as request from 'supertest';

describe('Feature: login', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUser.alice]);
  });

  describe('Happy path', () => {
    it('should return a response with set-cookie header', async () => {
      const payload = {
        email: e2eUser.alice.entity.props.email,
        password: 'Welcome@123',
      };

      const result = await request(app.getHttpServer())
        .post('/login')
        .send(payload);

      expect(result.status).toEqual(201);
      expect(result.header['set-cookie']).toBeDefined();
    });
  });

  describe('Happy path', () => {
    it('should return a response with set-cookie header', async () => {
      const payload = {
        email: 'fake-email',
        password: 'fake-password',
      };

      const result = await request(app.getHttpServer())
        .post('/login')
        .send(payload);

      expect(result.status).toEqual(401);
      expect(result.header['set-cookie']).toBeUndefined();
    });
  });
});
