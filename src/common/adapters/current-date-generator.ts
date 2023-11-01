import { IDateGenerator } from '../ports/date-generator.interface';

export class CurrentDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date();
  }

  currentDateAtMidnight(): Date {
    const now = this.now();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
