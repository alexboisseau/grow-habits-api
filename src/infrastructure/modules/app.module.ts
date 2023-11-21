import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { HabitModule } from './habit.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/validate';
import { TrackedHabitModule } from './tracked-habit.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HabitModule,
    TrackedHabitModule,
    ConfigModule.forRoot({
      validate,
    }),
  ],
})
export class AppModule {}
