import { Module } from '@nestjs/common';
import { CreateHabitToTrack } from '../../application/usecases/create-habit-to-track/create-habit-to-track.usecase';
import { I_HABIT_REPOSITORY } from '../../domain/ports/habit-repository.port';
import { CommonModule } from './common.module';
import { I_ID_GENERATOR } from '../../domain/ports/id-generator.port';
import { I_DATE_GENERATOR } from '../../domain/ports/date-generator.port';
import { UpdateTrackedHabitStatus } from '../../application/usecases/update-tracked-habit-status/update-tracked-habit-status.usecase';
import { I_TRACKED_HABIT_REPOSITORY } from '../../domain/ports/tracked-habit-repository.port';
import { HabitController } from '../../presentation/controllers/habit/habit.controller';
import { CreateHabitToTrackExceptionsMapper } from '../../presentation/controllers/habit/exceptions-mapper/create-habit-to-track-exceptions-mapper';
import { UpdateTrackedHabitStatusExceptionsMapper } from '../../presentation/controllers/habit/exceptions-mapper/update-tracked-habit-status-exceptions-mapper';
import { PrismaHabitRepository } from '../persistence/repositories/habit/prisma/prisma-habit-repository';
import { PrismaTrackedHabitRepository } from '../persistence/repositories/habit/prisma/prisma-tracked-habit-repository';
import { PrismaHabitMapper } from '../persistence/repositories/habit/prisma/prisma-habit.mapper';
import { PrismaTrackedHabitMapper } from '../persistence/repositories/habit/prisma/prisma-tracked-habit.mapper';
import { PRISMA_SERVICE } from '../persistence/prisma/prisma.service';
import { PrismaModule } from './prisma.module';
import { HabitPresenter } from '../../presentation/controllers/habit/habit.presenter';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    CreateHabitToTrackExceptionsMapper,
    UpdateTrackedHabitStatusExceptionsMapper,
    PrismaHabitMapper,
    PrismaTrackedHabitMapper,
    HabitPresenter,
    {
      provide: I_HABIT_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaHabitMapper],
      useFactory: (prisma, habitMapper) =>
        new PrismaHabitRepository(prisma, habitMapper),
    },
    {
      provide: I_TRACKED_HABIT_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaTrackedHabitMapper],
      useFactory: (prisma, trackedHabitMapper) =>
        new PrismaTrackedHabitRepository(prisma, trackedHabitMapper),
    },
    {
      provide: CreateHabitToTrack,
      inject: [I_HABIT_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (habitRepository, idGenerator, dateGenerator) =>
        new CreateHabitToTrack(habitRepository, idGenerator, dateGenerator),
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
      ) =>
        new UpdateTrackedHabitStatus(
          trackedHabitRepository,
          habitRepository,
          idGenerator,
          dateGenerator,
        ),
    },
  ],
  exports: [],
  controllers: [HabitController],
})
export class HabitModule {}
