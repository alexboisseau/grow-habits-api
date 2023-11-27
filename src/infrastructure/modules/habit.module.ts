import { Module } from '@nestjs/common';
import { CreateHabitToTrack } from '../../application/usecases/create-habit-to-track/create-habit-to-track.usecase';
import { I_HABIT_REPOSITORY } from '../../domain/ports/habit-repository.port';
import { CommonModule } from './common.module';
import { I_ID_GENERATOR } from '../../domain/ports/id-generator.port';
import { I_DATE_GENERATOR } from '../../domain/ports/date-generator.port';
import { HabitController } from '../../presentation/controllers/habit/habit.controller';
import { CreateHabitToTrackExceptionsMapper } from '../../presentation/controllers/habit/exceptions-mapper/create-habit-to-track-exceptions-mapper';
import { PrismaHabitRepository } from '../persistence/repositories/habit/prisma/prisma-habit-repository';
import { PrismaHabitMapper } from '../persistence/repositories/habit/prisma/prisma-habit.mapper';
import { PRISMA_SERVICE } from '../persistence/prisma/prisma.service';
import { PrismaModule } from './prisma.module';
import { HabitPresenter } from '../../presentation/controllers/habit/habit.presenter';

@Module({
  imports: [CommonModule, PrismaModule],
  providers: [
    CreateHabitToTrackExceptionsMapper,
    PrismaHabitMapper,
    HabitPresenter,
    {
      provide: I_HABIT_REPOSITORY,
      inject: [PRISMA_SERVICE, PrismaHabitMapper],
      useFactory: (prisma, habitMapper) =>
        new PrismaHabitRepository(prisma, habitMapper),
    },
    {
      provide: CreateHabitToTrack,
      inject: [I_HABIT_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (habitRepository, idGenerator, dateGenerator) =>
        new CreateHabitToTrack(habitRepository, idGenerator, dateGenerator),
    },
  ],
  exports: [I_HABIT_REPOSITORY],
  controllers: [HabitController],
})
export class HabitModule {}
