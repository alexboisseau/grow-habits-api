import { IDateGenerator } from '../../../domain/ports/date-generator.port';

export class CurrentDateGenerator implements IDateGenerator {
  now(timezone: string): Date {
    const now = new Date().toLocaleString('en-US', {
      timeZone: timezone,
    });

    const [month, day, year] = now.split(',')[0].split('/');
    const [hour, minute, second] = now.split(',')[1].split(' ')[1].split(':');

    return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second));
  }

  currentDateAtMidnight(timezone: string): Date {
    const now = new Date().toLocaleString('en-US', {
      timeZone: timezone,
    });

    const [month, day, year] = now.split(',')[0].split('/');

    return new Date(Date.UTC(+year, +month - 1, +day, 0, 0, 0));
  }
}
