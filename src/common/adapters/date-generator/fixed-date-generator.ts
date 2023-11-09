import { IDateGenerator } from '../../ports/date-generator.interface';

export class FixedDateGenerator implements IDateGenerator {
  now() {
    return new Date('2024-01-01T00:00:00.000Z');
  }

  currentDateAtMidnight(): Date {
    return new Date('2024-01-01T00:00:00.000Z');
  }
}
