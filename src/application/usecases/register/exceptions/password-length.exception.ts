import { DomainException } from '../../../../domain/shared/exception';

export class PasswordLengthException extends DomainException {
  constructor() {
    super('Password length must be greater than or equal to 8');
  }
}
