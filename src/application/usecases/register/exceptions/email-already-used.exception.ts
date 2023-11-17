import { DomainException } from '../../../../domain/shared/exception';

export class EmailAlreadyUsedException extends DomainException {
  constructor() {
    super('Email already used');
  }
}
