import { Module } from '@nestjs/common';
import { Register } from './usecases/register';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { CommonModule } from '../common/common.module';
import { I_PASSWORD_HANDLER } from '../common/ports/password-handler.interface';
import { PrismaUserRepository } from './adapters/prisma/prisma-user-repository';
import { PrismaUserMapper } from './adapters/prisma/prisma-user-mapper';
import { PrismaModule } from '../prisma/prisma.module';
import { PRISMA_SERVICE } from '../prisma/prisma.service';
import { HttpUserExceptionsMapper } from './presenters/http/http-exceptions-mapper';
import { HttpUserPresenter } from './presenters/http/http-user-presenter';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    PrismaUserMapper,
    HttpUserExceptionsMapper,
    {
      provide: I_USER_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaUserMapper],
      useFactory: (prisma, mapper) => {
        return new PrismaUserRepository(prisma, mapper);
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
  controllers: [HttpUserPresenter],
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
