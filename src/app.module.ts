import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitModule } from './habits/habit.module';

@Module({
  imports: [HabitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
