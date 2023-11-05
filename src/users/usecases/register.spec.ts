import { FixedIdGenerator } from '../../common/adapters/fixed-id-generator';
import { FakePasswordHandler } from '../../common/adapters/password-handler/fake-password-handler';
import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';
import { userSeeds } from '../tests/user-seeds';
import { Register } from './register';

describe('Feature: Register', () => {
  let userRepository: IUserRepository;
  let idGenerator: IIdGenerator;
  let passwordHasher: FakePasswordHandler;
  let usecase: Register;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([userSeeds.bob]);
    idGenerator = new FixedIdGenerator();
    passwordHasher = new FakePasswordHandler();
    usecase = new Register(userRepository, idGenerator, passwordHasher);
  });

  describe('Happy path', () => {
    it('should return an id', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '12345678',
        confirmPassword: '12345678',
      };

      const response = await usecase.execute({
        ...payload,
      });

      expect(response).toEqual({
        id: 'id-1',
      });
    });

    it('should hash the password before saving it', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '12345678',
        confirmPassword: '12345678',
      };

      await usecase.execute({ ...payload });

      const hashCalls = passwordHasher.getHashCalls();
      expect(hashCalls).toContain('12345678');
    });

    it('should persists the created user', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '12345678',
        confirmPassword: '12345678',
      };

      const { id } = await usecase.execute({
        ...payload,
      });

      const createdUser = (await userRepository.findById(id)) as User;

      expect(createdUser.props).toEqual({
        id,
        email: 'alice@gmail.com',
        password: 'hashed-12345678',
      });
    });
  });

  describe('Unhappy path', () => {
    it('should fail if password and confirm password fields are not equals', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '12345678',
        confirmPassword: '87654321',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrow(
        "Password and confirm password fields don't match",
      );
    });

    it('should fail if password length is less than 8', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '123456',
        confirmPassword: '123456',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrow(
        'Password length must be greater than or equal to 8',
      );
    });

    it('should fail if the email is already used', async () => {
      const payload = {
        email: userSeeds.bob.props.email,
        password: '12345678',
        confirmPassword: '12345678',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrow(
        'Email already used',
      );
    });

    it('should fail if the email is not valid', async () => {
      const payload = {
        email: "I'm not an email",
        password: '12345678',
        confirmPassword: '12345678',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrow(
        'Invalid email format',
      );
    });
  });
});
