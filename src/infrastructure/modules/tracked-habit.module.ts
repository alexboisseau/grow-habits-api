import { Module } from '@nestjs/common';
import { TrackedHabitController } from '../../presentation/controllers/tracked-habit/tracked-habit.controller';
import { I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY } from '../../domain/ports/get-tracked-habits-by-date-and-user-id.port';
import { PrismaGetTrackedHabitsByDateAndUserIdQuery } from '../persistence/queries/get-user-habits-to-track/prisma/prisma-get-tracked-habits-by-date-and-user-id-query';
import { PrismaModule } from './prisma.module';
import { PrismaTrackedHabitMapper } from '../persistence/repositories/habit/prisma/prisma-tracked-habit.mapper';
import { PRISMA_SERVICE } from '../persistence/prisma/prisma.service';
import { GetTrackedHabitsByDateAndUserIdPresenter } from '../../presentation/controllers/tracked-habit/tracked-habit.presenter';
import { I_GET_TRACKED_HABITS_GRID_QUERY } from '../../domain/ports/get-tracked-habits-grid-query.port';
import { PrismaGetTrackedHabitsGridQuery } from '../persistence/queries/get-tracked-habits-grid/prisma/prisma-get-tracked-habits-grid-query';
import { GetTrackedHabitsByDateAndUserIdQueryExceptionsMapper } from '../../presentation/controllers/tracked-habit/exceptions-mapper/get-tracked-habits-by-date-and-user-id-query-exceptions-mapper';
import { GetTrackedHabitsGridQueryExceptionsMapper } from '../../presentation/controllers/tracked-habit/exceptions-mapper/get-tracked-habits-grid-query-exceptions-mapper';
import { UpdateTrackedHabitStatus } from '../../application/usecases/update-tracked-habit-status/update-tracked-habit-status.usecase';
import { I_TRACKED_HABIT_REPOSITORY } from '../../domain/ports/tracked-habit-repository.port';
import { I_HABIT_REPOSITORY } from '../../domain/ports/habit-repository.port';
import { I_ID_GENERATOR } from '../../domain/ports/id-generator.port';
import { I_DATE_GENERATOR } from '../../domain/ports/date-generator.port';
import { PrismaTrackedHabitRepository } from '../persistence/repositories/habit/prisma/prisma-tracked-habit-repository';
import { HabitModule } from './habit.module';
import { UpdateTrackedHabitStatusExceptionsMapper } from '../../presentation/controllers/tracked-habit/exceptions-mapper/update-tracked-habit-status-exceptions-mapper';
import { CommonModule } from './common.module';

@Module({
  imports: [CommonModule, PrismaModule, HabitModule],
  providers: [
    GetTrackedHabitsByDateAndUserIdPresenter,
    UpdateTrackedHabitStatusExceptionsMapper,
    GetTrackedHabitsByDateAndUserIdQueryExceptionsMapper,
    GetTrackedHabitsGridQueryExceptionsMapper,
    PrismaTrackedHabitMapper,
    {
      provide: I_TRACKED_HABIT_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaTrackedHabitMapper],
      useFactory: (prisma, trackedHabitMapper) =>
        new PrismaTrackedHabitRepository(prisma, trackedHabitMapper),
    },
    {
      provide: I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY,
      inject: [PRISMA_SERVICE, PrismaTrackedHabitMapper],
      useFactory: (prisma, trackedHabitMapper) => {
        return new PrismaGetTrackedHabitsByDateAndUserIdQuery(
          prisma,
          trackedHabitMapper,
        );
      },
    },
    {
      provide: I_GET_TRACKED_HABITS_GRID_QUERY,
      inject: [PRISMA_SERVICE],
      useFactory: (prisma) => {
        return new PrismaGetTrackedHabitsGridQuery(prisma);
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
      ) =>
        new UpdateTrackedHabitStatus(
          trackedHabitRepository,
          habitRepository,
          idGenerator,
          dateGenerator,
        ),
    },
  ],
  controllers: [TrackedHabitController],
  exports: [],
})
export class TrackedHabitModule {}
