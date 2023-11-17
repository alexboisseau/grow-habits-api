import { User } from '../../../domain/entities/user.entity';
import { FixedIdGenerator } from '../../../infrastructure/adapters/id-generator/fixed-id-generator';
import { FakePasswordHasher } from '../../../infrastructure/adapters/password-hasher/fake-password-hasher';
import { InMemoryUserRepository } from '../../../infrastructure/persistence/repositories/user/in-memory/in-memory-user-repository';
import { ConfirmPasswordException } from '../register/exceptions/confirm-password.exception';
import { EmailAlreadyUsedException } from '../register/exceptions/email-already-used.exception';
import { EmailFormatException } from '../register/exceptions/email-format.exception';
import { PasswordLengthException } from '../register/exceptions/password-length.exception';
import { Register } from '../register/register.usecase';
import { userSeeds } from './seeds/user.seeds';

describe('Feature: Register', () => {
  let userRepository: InMemoryUserRepository;
  let idGenerator: FixedIdGenerator;
  let passwordHasher: FakePasswordHasher;
  let usecase: Register;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([userSeeds.bob]);
    idGenerator = new FixedIdGenerator();
    passwordHasher = new FakePasswordHasher();
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

      await expect(() => usecase.execute({ ...payload })).rejects.toThrowError(
        ConfirmPasswordException,
      );
    });

    it('should fail if password length is less than 8', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '123456',
        confirmPassword: '123456',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrowError(
        PasswordLengthException,
      );
    });

    it('should fail if the email is already used', async () => {
      const payload = {
        email: userSeeds.bob.props.email,
        password: '12345678',
        confirmPassword: '12345678',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrowError(
        EmailAlreadyUsedException,
      );
    });

    it('should fail if the email is not valid', async () => {
      const payload = {
        email: "I'm not an email",
        password: '12345678',
        confirmPassword: '12345678',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrowError(
        EmailFormatException,
      );
    });
  });
});
