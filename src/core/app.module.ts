import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitModule } from '../habits/habit.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [HabitModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
