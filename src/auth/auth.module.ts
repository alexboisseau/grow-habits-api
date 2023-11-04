import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { CommonModule } from '../common/common.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './local/local.strategy';
import { I_USER_REPOSITORY } from '../users/ports/user-repository.interface';
import { I_PASSWORD_HANDLER } from '../common/ports/password-handler.interface';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session/session.serializer';

@Module({
  imports: [
    UserModule,
    CommonModule,
    PassportModule.register({ session: true }),
  ],
  providers: [
    {
      provide: AuthService,
      inject: [I_USER_REPOSITORY, I_PASSWORD_HANDLER],
      useFactory: (userRepository, passwordHandler) =>
        new AuthService(userRepository, passwordHandler),
    },
    LocalStrategy,
    {
      provide: SessionSerializer,
      inject: [I_USER_REPOSITORY],
      useFactory: (userRepository) => new SessionSerializer(userRepository),
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
