import { FakePasswordHasher } from '../adapters/fake-password-hasher';
import { InMemorySessionManager } from '../adapters/in-memory-session-manager';
import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { User } from '../entities/user.entity';
import { Login } from './login';

describe('Feature: login', () => {
  const alice = new User({
    id: 'id-1',
    password: 'hashed-Welcome@123',
    email: 'alice@gmail.com',
  });

  let userRepository: InMemoryUserRepository;
  let passwordHasher: FakePasswordHasher;
  let sessionManager: InMemorySessionManager;
  let useCase: Login;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([alice]);
    passwordHasher = new FakePasswordHasher();
    sessionManager = new InMemorySessionManager();
    useCase = new Login(userRepository, passwordHasher, sessionManager);
  });

  describe('Happy path', () => {
    it('should create a session with the userId', async () => {
      const payload = {
        email: alice.props.email,
        password: 'Welcome@123',
      };

      const { sessionId } = await useCase.execute({
        ...payload,
      });

      expect(sessionManager.getSessionSync(sessionId)).toEqual(alice.props.id);
    });
  });

  describe('Unhappy path : wrong credentials', () => {
    it('should fail', async () => {
      const payload = {
        email: alice.props.email,
        password: 'random-password',
      };

      await expect(useCase.execute(payload)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('Unhappy path : user not found', () => {
    it('should fail', async () => {
      const payload = {
        email: 'unknow@gmail.com',
        password: 'Welcome@123',
      };

      await expect(useCase.execute(payload)).rejects.toThrow('User not found');
    });
  });
});
