import { FixedIdGenerator } from '../../common/adapters/fixed-id-generator';
import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';
import { Register } from './register';

describe('Feature: Register', () => {
  let userRepository: IUserRepository;
  let idGenerator: IIdGenerator;
  let usecase: Register;

  const bob = new User({
    id: 'id-2',
    email: 'bob@gmail.com',
    password: 'azerty',
  });

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([bob]);
    idGenerator = new FixedIdGenerator();
    usecase = new Register(userRepository, idGenerator);
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
        password: '12345678',
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

    it('should fail if the email is already associated with a user', async () => {
      const payload = {
        email: bob.props.email,
        password: '12345678',
        confirmPassword: '12345678',
      };

      await expect(() => usecase.execute({ ...payload })).rejects.toThrow(
        'Email already associated with a user',
      );
    });
  });
});
