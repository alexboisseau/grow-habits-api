import { Module } from '@nestjs/common';
import { CreateAHabitToTrack } from './usecases/create-a-habit-to-track';
import { InMemoryHabitRepository } from './adapters/in-memory-habit-repository';
import { I_HABIT_REPOSITORY } from './ports/habit-repository.interface';
import { I_DATE_GENERATOR } from '../common/ports/date-generator.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { HabitController } from './habit.controller';
import { CommonModule } from '../common/common.module';
import { CompleteHabit } from './usecases/complete-habit';
import { InMemoryTrackedHabitRepository } from './adapters/in-memory-tracked-repository';
import { I_TRACKED_HABIT_REPOSITORY } from './ports/tracked-habit-repository.interface';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: I_HABIT_REPOSITORY,
      useFactory: () => {
        return new InMemoryHabitRepository();
      },
    },
    {
      provide: I_TRACKED_HABIT_REPOSITORY,
      useFactory: () => {
        return new InMemoryTrackedHabitRepository();
      },
    },
    {
      provide: CreateAHabitToTrack,
      inject: [I_HABIT_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (habitRepository, idGenerator, dateGenerator) => {
        return new CreateAHabitToTrack(
          habitRepository,
          idGenerator,
          dateGenerator,
        );
      },
    },
    {
      provide: CompleteHabit,
      inject: [
        I_TRACKED_HABIT_REPOSITORY,
        I_HABIT_REPOSITORY,
        I_ID_GENERATOR,
        I_DATE_GENERATOR,
      ],
      useFactory: (
        trackedHabitRepository,
        habitRepository,
        idGenerator,
        dateGenerator,
      ) => {
        return new CompleteHabit(
          trackedHabitRepository,
          habitRepository,
          idGenerator,
          dateGenerator,
        );
      },
    },
  ],
  controllers: [HabitController],
})
export class HabitModule {}
