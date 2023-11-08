import { Module } from '@nestjs/common';
import { I_DATE_GENERATOR } from './ports/date-generator.interface';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { CurrentDateGenerator } from './adapters/current-date-generator';
import { I_PASSWORD_HANDLER } from './ports/password-handler.interface';
import { FakePasswordHandler } from './adapters/password-handler/fake-password-handler';
import { RandomIdGenerator } from './adapters/random-id-generator';

@Module({
  providers: [
    {
      provide: I_DATE_GENERATOR,
      useFactory: () => {
        return new CurrentDateGenerator();
      },
    },
    {
      provide: I_ID_GENERATOR,
      useFactory: () => {
        return new RandomIdGenerator();
      },
    },
    {
      provide: I_PASSWORD_HANDLER,
      useFactory: () => {
        return new FakePasswordHandler();
      },
    },
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_PASSWORD_HANDLER],
})
export class CommonModule {}
