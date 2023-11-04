import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../users/ports/user-repository.interface';
import { User } from '../../users/entities/user.entity';
import { UserNotFoundException } from '../../users/exceptions/user-not-found';
import { IPasswordHandler } from '../../common/ports/password-handler.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHandler: IPasswordHandler,
  ) {}

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (user === null) throw new UserNotFoundException();
    await this.validatePassword(user, password);

    return user;
  }

  private async validatePassword(user: User, password: string) {
    const passwordIsValid = await this.passwordHandler.compare(
      password,
      user.props.password,
    );

    if (!passwordIsValid) throw new UnauthorizedException();
  }
}
