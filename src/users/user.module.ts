import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Register } from './usecases/register';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { CommonModule } from '../common/common.module';
import { InMemorySessionManager } from './adapters/in-memory-session-manager';
import { I_SESSION_MANAGER } from './ports/session-manager.interface';
import { I_PASSWORD_HANDLER } from '../common/ports/password-handler.interface';
import { PrismaUserRepository } from './adapters/prisma/prisma-user-repository';
import { PrismaUserMapper } from './adapters/prisma/prisma-user-mapper';
import { PrismaModule } from '../prisma/prisma.module';
import { PRISMA_SERVICE } from '../prisma/prisma.service';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    PrismaUserMapper,
    {
      provide: I_USER_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaUserMapper],
      useFactory: (prisma, mapper) => {
        return new PrismaUserRepository(prisma, mapper);
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
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
