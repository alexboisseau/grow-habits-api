import { IDateGenerator } from '../../../domain/ports/date-generator.port';

export class CurrentDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date();
  }

  currentDateAtMidnight(): Date {
    const now = this.now();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
