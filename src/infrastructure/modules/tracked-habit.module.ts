import { Module } from '@nestjs/common';
import { TrackedHabitController } from '../../presentation/controllers/tracked-habit/tracked-habit.controller';
import { I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY } from '../../domain/ports/get-tracked-habits-by-date-and-user-id.port';
import { PrismaGetTrackedHabitsByDateAndUserIdQuery } from '../persistence/queries/get-user-habits-to-track/prisma/prisma-get-tracked-habits-by-date-and-user-id-query';
import { PrismaModule } from './prisma.module';
import { PrismaTrackedHabitMapper } from '../persistence/repositories/habit/prisma/prisma-tracked-habit.mapper';
import { PRISMA_SERVICE } from '../persistence/prisma/prisma.service';
import { GetTrackedHabitsByDateAndUserIdPresenter } from '../../presentation/controllers/tracked-habit/tracked-habit.presenter';

@Module({
  imports: [PrismaModule],
  providers: [
    GetTrackedHabitsByDateAndUserIdPresenter,
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
  ],
  controllers: [TrackedHabitController],
  exports: [],
})
export class TrackedHabitModule {}
