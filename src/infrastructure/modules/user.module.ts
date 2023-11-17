import { Module } from '@nestjs/common';
import { UserController } from '../../presentation/controllers/user/user.controller';
import { Register } from '../../application/usecases/register/register.usecase';
import { I_USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import { CommonModule } from './common.module';
import { I_ID_GENERATOR } from '../../domain/ports/id-generator.port';
import { I_PASSWORD_HASHER } from '../../domain/ports/password-hasher.port';
import { RegisterExceptionsMapper } from '../../presentation/controllers/user/exceptions-mapper/register-exceptions-mapper';
import { PrismaModule } from './prisma.module';
import { PrismaUserRepository } from '../persistence/repositories/user/prisma/prisma-user-repository';
import { PRISMA_SERVICE } from '../persistence/prisma/prisma.service';
import { PrismaUserMapper } from '../persistence/repositories/user/prisma/prisma-user.mapper';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    PrismaUserMapper,
    RegisterExceptionsMapper,
    {
      provide: I_USER_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaUserMapper],
      useFactory: (prisma, mapper) => {
        return new PrismaUserRepository(prisma, mapper);
      },
    },
    {
      provide: Register,
      inject: [I_USER_REPOSITORY, I_ID_GENERATOR, I_PASSWORD_HASHER],
      useFactory: (userRepository, idGenerator, passwordHasher) =>
        new Register(userRepository, idGenerator, passwordHasher),
    },
  ],
  controllers: [UserController],
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
