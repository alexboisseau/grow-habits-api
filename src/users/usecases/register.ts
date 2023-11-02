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
    if (request.password !== request.confirmPassword) {
      throw new Error("Password and confirm password fields don't match");
    }

    if (request.password.length < 8) {
      throw new Error('Password length must be greater than or equal to 8');
    }

    const id = this.idGenerator.generate();

    const createdUser = new User({
      id,
      email: request.email,
      password: request.password,
    });

    await this.userRepository.create(createdUser);

    return {
      id,
    };
  }
}
