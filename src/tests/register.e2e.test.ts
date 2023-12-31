import { TestApp } from './utils/test-app';
import * as request from 'supertest';

describe('Feature: register a user', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
  });

  afterEach(async () => {
    await app.cleanUp();
  });

  describe('Happy path', () => {
    it('should register the user', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: 'Welcome@123',
        confirmPassword: 'Welcome@123',
      };

      const result = await request(app.getHttpServer())
        .post('/users/register')
        .send(payload);

      expect(result.status).toEqual(201);
      expect(result.body.id).toBeDefined();
    });
  });
});
