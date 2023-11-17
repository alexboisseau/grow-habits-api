import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/ports/user-repository.port';
import { IIdGenerator } from '../../../domain/ports/id-generator.port';
import { IPasswordHasher } from '../../../domain/ports/password-hasher.port';
import { ConfirmPasswordException } from './exceptions/confirm-password.exception';
import { EmailAlreadyUsedException } from './exceptions/email-already-used.exception';
import { EmailFormatException } from './exceptions/email-format.exception';
import { PasswordLengthException } from './exceptions/password-length.exception';

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
    private readonly idService: IIdGenerator,
    private readonly passwordService: IPasswordHasher,
  ) {}

  async execute(request: Request): Promise<Response> {
    this.validateEmail(request.email);
    this.validatePassword(request.password);
    this.validateConfirmPassword(request.password, request.confirmPassword);
    await this.validateEmailIsFree(request.email);

    const hashedPassword = await this.passwordService.hash(request.password);

    const createdUser = new User({
      id: this.idService.generate(),
      email: request.email,
      password: hashedPassword,
    });

    await this.userRepository.create(createdUser);

    return {
      id: createdUser.props.id,
    };
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new PasswordLengthException();
    }
  }

  private validateConfirmPassword(
    password: string,
    confirmPassword: string,
  ): void {
    if (password !== confirmPassword) {
      throw new ConfirmPasswordException();
    }
  }

  private validateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new EmailFormatException();
    }
  }

  private async validateEmailIsFree(email: string): Promise<void> {
    if (await this.userRepository.findByEmail(email)) {
      throw new EmailAlreadyUsedException();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }
}
