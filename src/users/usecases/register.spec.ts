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

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    idGenerator = new FixedIdGenerator();
    usecase = new Register(userRepository, idGenerator);
  });

  describe('Happy path', () => {
    it('should return an id', async () => {
      const payload = {
        email: 'alice@gmail.com',
        password: '123456',
        confirmPassword: '123456',
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
        password: '123456',
        confirmPassword: '123456',
      };

      const { id } = await usecase.execute({
        ...payload,
      });

      const createdUser = (await userRepository.findById(id)) as User;

      expect(createdUser.props).toEqual({
        id,
        email: 'alice@gmail.com',
        password: '123456',
        confirmPassword: '123456',
      });
    });
  });
});
