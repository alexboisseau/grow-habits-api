import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Register } from './usecases/register';
import { InMemoryUserRepository } from './adapters/in-memory-user-repository';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { CommonModule } from '../common/common.module';
import { InMemorySessionManager } from './adapters/in-memory-session-manager';
import { I_SESSION_MANAGER } from './ports/session-manager.interface';
import { I_PASSWORD_HANDLER } from '../common/ports/password-handler.interface';

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
      provide: I_SESSION_MANAGER,
      useFactory: () => {
        return new InMemorySessionManager();
      },
    },
    {
      provide: Register,
      inject: [I_USER_REPOSITORY, I_ID_GENERATOR, I_PASSWORD_HANDLER],
      useFactory: (userRepository, idGenerator, passwordHandler) => {
        return new Register(userRepository, idGenerator, passwordHandler);
      },
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
