import { DomainException } from '../../../../domain/shared/exception';

export class ConfirmPasswordException extends DomainException {
  constructor() {
    super("Password and confirm password fields don't match");
  }
}
