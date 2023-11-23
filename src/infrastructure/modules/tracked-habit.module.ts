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

@Module({
  imports: [PrismaModule],
  providers: [
    GetTrackedHabitsByDateAndUserIdPresenter,
    GetTrackedHabitsByDateAndUserIdQueryExceptionsMapper,
    GetTrackedHabitsGridQueryExceptionsMapper,
    PrismaTrackedHabitMapper,
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
  ],
  controllers: [TrackedHabitController],
  exports: [],
})
export class TrackedHabitModule {}
