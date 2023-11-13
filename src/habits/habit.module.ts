import { Module } from '@nestjs/common';
import { CreateHabitToTrack } from './usecases/create-habit-to-track';
import { I_HABIT_REPOSITORY } from './ports/habit-repository.interface';
import { I_DATE_GENERATOR } from '../common/ports/date-generator.interface';
import { I_ID_GENERATOR } from '../common/ports/id-generator.interface';
import { HttpHabitPresenter } from './presenters/http/http-habit-presenter';
import { CommonModule } from '../common/common.module';
import { UpdateTrackedHabitStatus } from './usecases/update-tracked-habit-status';
import { I_TRACKED_HABIT_REPOSITORY } from './ports/tracked-habit-repository.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { PRISMA_SERVICE } from '../prisma/prisma.service';
import { PrismaHabitMapper } from './adapters/prisma/prisma-habit-mapper';
import { PrismaHabitRepository } from './adapters/prisma/prisma-habit-repository';
import { PrismaTrackedHabitRepository } from './adapters/prisma/prisma-tracked-habit-repository';
import { PrismaTrackedHabitMapper } from './adapters/prisma/prisma-tracked-habit-mapper';
import { HttpHabitExceptionsMapper } from './presenters/http/http-habit-exception-mapper';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    PrismaHabitMapper,
    PrismaTrackedHabitMapper,
    HttpHabitExceptionsMapper,
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
      provide: CreateHabitToTrack,
      inject: [I_HABIT_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (habitRepository, idGenerator, dateGenerator) => {
        return new CreateHabitToTrack(
          habitRepository,
          idGenerator,
          dateGenerator,
        );
      },
    },
    {
      provide: UpdateTrackedHabitStatus,
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
        return new UpdateTrackedHabitStatus(
          trackedHabitRepository,
          habitRepository,
          idGenerator,
          dateGenerator,
        );
      },
    },
  ],
  controllers: [HttpHabitPresenter],
})
export class HabitModule {}
