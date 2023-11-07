import { Module } from '@nestjs/common';
import { CreateAHabitToTrack } from './usecases/create-a-habit-to-track';
import { I_HABIT_REPOSITORY } from './ports/habit-repository.interface';
import { I_DATE_GENERATOR } from '../common/ports/date-generator.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { HabitController } from './habit.controller';
import { CommonModule } from '../common/common.module';
import { CompleteHabit } from './usecases/complete-habit';
import { I_TRACKED_HABIT_REPOSITORY } from './ports/tracked-habit-repository.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { PRISMA_SERVICE } from '../prisma/prisma.service';
import { PrismaHabitMapper } from './adapters/prisma/prisma-habit-mapper';
import { PrismaHabitRepository } from './adapters/prisma/prisma-habit-repository';
import { PrismaTrackedHabitRepository } from './adapters/prisma/prisma-tracked-habit-repository';
import { PrismaTrackedHabitMapper } from './adapters/prisma/prisma-tracked-habit-mapper';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    PrismaHabitMapper,
    PrismaTrackedHabitMapper,
    {
      provide: I_HABIT_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaHabitMapper],
      useFactory: (client, mapper) => {
        return new PrismaHabitRepository(client, mapper);
      },
    },
    {
      provide: I_TRACKED_HABIT_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaTrackedHabitMapper],
      useFactory: (client, mapper) => {
        return new PrismaTrackedHabitRepository(client, mapper);
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
