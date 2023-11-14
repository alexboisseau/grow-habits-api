import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { IPasswordHandler } from '../../common/ports/password-handler.interface';
import { UseCase } from '../../shared/usecase';
import { User } from '../entities/user.entity';
import { ConfirmPasswordException } from '../exceptions/confirm-password';
import { EmailAlreadyUsedException } from '../exceptions/email-already-used';
import { EmailFormatException } from '../exceptions/email-format';
import { PasswordLengthException } from '../exceptions/password-length';
import { IUserRepository } from '../ports/user-repository.interface';

type Request = {
  email: string;
  password: string;
  confirmPassword: string;
};

type Response = {
  id: string;
};

export class Register implements UseCase<Request, Response> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly passwordHasher: IPasswordHandler,
  ) {}

  async execute(request: Request): Promise<Response> {
    this.validateEmail(request.email);
    this.validatePassword(request.password);
    this.validateConfirmPassword(request.password, request.confirmPassword);
    await this.validateEmailIsFree(request.email);

    const hashedPassword = await this.passwordHasher.hash(request.password);

    const createdUser = new User({
      id: this.idGenerator.generate(),
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
