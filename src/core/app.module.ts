import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitModule } from '../habits/habit.module';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { validate } from './config/validate';

@Module({
  imports: [
    HabitModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
