import { User } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user-not-found';
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
    const user = await this.userRepository.findByEmail(request.email);

    this.validateUser(user);
    await this.validatePassword(user!, request.password);

    const sessionId = await this.sessionManager.createSession(user!.props.id);

    return {
      sessionId,
    };
  }

  private validateUser(user: User | null) {
    if (user === null) throw new UserNotFoundException();
  }

  private async validatePassword(user: User, password: string) {
    const passwordIsValid = await this.passwordHasher.compare(
      password,
      user.props.password,
    );

    if (!passwordIsValid) throw new WrongCredentialsException();
  }
}
