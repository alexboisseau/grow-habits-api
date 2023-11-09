import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../users/ports/user-repository.interface';
import { User } from '../../users/entities/user.entity';
import { IPasswordHandler } from '../../common/ports/password-handler.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHandler: IPasswordHandler,
  ) {}

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (user === null) return null;
    if ((await this.isPasswordValid(user, password)) === false) return null;

    return user;
  }

  private async isPasswordValid(user: User, password: string) {
    const passwordIsValid = await this.passwordHandler.compare(
      password,
      user.props.password,
    );

    return passwordIsValid;
  }
}
