import { Module } from '@nestjs/common';
import { CreateAHabitToTrack } from './usecases/create-a-habit-to-track';
import { InMemoryHabitRepository } from './adapters/in-memory-habit-repository';
import { I_HABIT_REPOSITORY } from './ports/habit-repository.interface';
import { I_DATE_GENERATOR } from './ports/date-generator.interface';
import { FixedDateGenerator } from './adapters/fixed-date-generator';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { FixedIdGenerator } from './adapters/fixed-id-generator';
import { HabitController } from './habit.controller';

@Module({
  providers: [
    {
      provide: I_DATE_GENERATOR,
      useFactory: () => {
        return new FixedDateGenerator();
      },
    },
    {
      provide: I_ID_GENERATOR,
      useFactory: () => {
        return new FixedIdGenerator();
      },
    },
    {
      provide: I_HABIT_REPOSITORY,
      useFactory: () => {
        return new InMemoryHabitRepository();
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
  ],
  controllers: [HabitController],
})
export class HabitModule {}
