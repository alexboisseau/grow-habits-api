import { Module } from '@nestjs/common';
import { I_DATE_GENERATOR } from '../../domain/ports/date-generator.port';
import { CurrentDateGenerator } from '../adapters/date-generator/current-date-generator';
import { I_ID_GENERATOR } from '../../domain/ports/id-generator.port';
import { RandomIdGenerator } from '../adapters/id-generator/random-id-generator';
import { I_PASSWORD_HASHER } from '../../domain/ports/password-hasher.port';
import { BcryptPasswordHasher } from '../adapters/password-hasher/bcrypt-password-hasher';
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
      provide: I_PASSWORD_HASHER,
      inject: [ConfigService],
      useFactory: (config) => {
        const saltRounds = config.get('bcrypt.saltOrRounds');
        return new BcryptPasswordHasher(parseInt(saltRounds));
      },
    },
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_PASSWORD_HASHER],
})
export class CommonModule {}
