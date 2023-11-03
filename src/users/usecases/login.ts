import { User } from '../entities/user.entity';
import { WrongCredentialsException } from '../exceptions/wrong-credentials';
import { IPasswordHasher } from '../ports/password-hasher.interface';
import { ISessionManager } from '../ports/session-manager.interface';
import { IUserRepository } from '../ports/user-repository.interface';

type Request = {
  email: string;
  password: string;
};

type Response = {
  sessionId: string;
};

export class Login {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly sessionManager: ISessionManager,
  ) {}

  async execute(request: Request): Promise<Response> {
    const user = (await this.userRepository.findByEmail(request.email)) as User;

    const passwordIsValid = await this.passwordHasher.compare(
      request.password,
      user.props.password,
    );

    if (!passwordIsValid) throw new WrongCredentialsException();

    const sessionId = await this.sessionManager.createSession('id-1');

    return {
      sessionId,
    };
  }
}
