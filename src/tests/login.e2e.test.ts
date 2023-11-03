import {
  ISessionManager,
  I_SESSION_MANAGER,
} from '../users/ports/session-manager.interface';
import { e2eUser } from './seeds/user-seeds';
import { parseSetCookie } from './utils/parse-set-cookie';
import { TestApp } from './utils/test-app';
import * as request from 'supertest';

describe('Feature: login a user', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUser.alice]);
  });

  describe('Happy path', () => {
    it('should create a session with the user id', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: 'Welcome@123',
      };

      const result = await request(app.getHttpServer())
        .post('/users/login')
        .send(payload);

      expect(result.status).toEqual(200);

      const parsedSessionCookie = parseSetCookie(
        result.header['set-cookie'][0],
      );
      const sessionCookie = parsedSessionCookie['sessionId'];
      const sessionManager = app.get<ISessionManager>(I_SESSION_MANAGER);

      const userId = await sessionManager.getSession(sessionCookie);

      expect(userId).toEqual('id-1');
    });
  });
});
