import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';

type Request = {
  email: string;
  password: string;
  confirmPassword: string;
};

type Response = {
  id: string;
};

export class Register {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(request: Request): Promise<Response> {
    const id = this.idGenerator.generate();

    const createdUser = new User({
      id,
      ...request,
    });

    await this.userRepository.create(createdUser);

    return {
      id,
    };
  }
}
