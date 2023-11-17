import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { HabitModule } from './habit.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/validate';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HabitModule,
    ConfigModule.forRoot({
      validate,
    }),
  ],
})
export class AppModule {}
