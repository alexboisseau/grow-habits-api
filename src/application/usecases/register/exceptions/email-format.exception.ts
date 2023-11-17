import { DomainException } from '../../../../domain/shared/exception';

export class EmailFormatException extends DomainException {
  constructor() {
    super('Invalid email format');
  }
}
