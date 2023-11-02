import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Register } from './usecases/register';
import { InMemoryUserRepository } from './adapters/in-memory-user-repository';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { FakePasswordHasher } from './adapters/fake-password-hasher';
import { I_PASSWORD_HASHER } from './ports/password-hasher.interface';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useFactory: () => {
        return new InMemoryUserRepository();
      },
    },
    {
      provide: I_PASSWORD_HASHER,
      useFactory: () => {
        return new FakePasswordHasher();
      },
    },
    {
      provide: Register,
      inject: [I_USER_REPOSITORY, I_ID_GENERATOR, I_PASSWORD_HASHER],
      useFactory: (userRepository, idGenerator, passwordHasheur) => {
        return new Register(userRepository, idGenerator, passwordHasheur);
      },
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
