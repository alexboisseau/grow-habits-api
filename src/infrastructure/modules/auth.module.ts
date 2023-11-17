import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/services/auth.service';
import { LocalStrategy } from '../auth/local/local.strategy';
import { SessionSerializer } from '../auth/session/session.serializer';
import { UserModule } from './user.module';
import { CommonModule } from './common.module';
import { I_USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import { I_PASSWORD_HASHER } from '../../domain/ports/password-hasher.port';
import { AuthController } from '../../presentation/controllers/auth/auth.controller';

@Module({
  imports: [
    UserModule,
    CommonModule,
    PassportModule.register({ session: true }),
  ],
  providers: [
    LocalStrategy,
    {
      provide: AuthService,
      inject: [I_USER_REPOSITORY, I_PASSWORD_HASHER],
      useFactory: (userRepository, passwordHandler) =>
        new AuthService(userRepository, passwordHandler),
    },
    {
      provide: SessionSerializer,
      inject: [I_USER_REPOSITORY],
      useFactory: (userRepository) => new SessionSerializer(userRepository),
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
