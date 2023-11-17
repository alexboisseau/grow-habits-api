import { DomainException } from '../../../../domain/shared/exception';

export class UnauthorizedException extends DomainException {
  constructor() {
    super('Unauthorized access');
  }
}
