import { InMemorySessionManager } from '../adapters/in-memory-session-manager';
import { User } from '../entities/user.entity';
import { Login } from './login';

describe('Feature: login', () => {
  const alice = new User({
    id: 'id-1',
    password: 'Welcome@123',
    email: 'alice@gmail.com',
  });

  let sessionManager: InMemorySessionManager;
  let useCase: Login;

  beforeEach(() => {
    sessionManager = new InMemorySessionManager();
    useCase = new Login(sessionManager);
  });

  describe('Happy path', () => {
    it('should create a session with the userId', async () => {
      const payload = {
        email: alice.props.email,
        password: alice.props.password,
      };

      const { sessionId } = await useCase.execute({
        ...payload,
      });

      expect(sessionManager.getSessionSync(sessionId)).toEqual(alice.props.id);
    });
  });
});
