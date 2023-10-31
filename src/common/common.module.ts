import { Module } from '@nestjs/common';
import { I_DATE_GENERATOR } from './ports/date-generator.interface';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { CurrentDateGenerator } from './adapters/current-date-generator';
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
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR],
})
export class CommonModule {}
