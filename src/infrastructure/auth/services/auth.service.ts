import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/ports/user-repository.port';
import { IPasswordHasher } from '../../../domain/ports/password-hasher.port';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHandler: IPasswordHasher,
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
