import { Module } from '@nestjs/common';
import { I_DATE_GENERATOR } from './ports/date-generator.interface';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { CurrentDateGenerator } from './adapters/date-generator/current-date-generator';
import { I_PASSWORD_HANDLER } from './ports/password-handler.interface';
import { RandomIdGenerator } from './adapters/id-generator/random-id-generator';
import { BcryptPasswordHandler } from './adapters/password-handler/bcrypt-password-handler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
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
      inject: [ConfigService],
      useFactory: (config) => {
        const saltRounds = config.get('bcrypt.saltOrRounds');
        return new BcryptPasswordHandler(parseInt(saltRounds));
      },
    },
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_PASSWORD_HANDLER],
})
export class CommonModule {}
