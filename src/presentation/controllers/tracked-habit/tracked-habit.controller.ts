import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import {
  IGetTrackedHabitsGridQuery,
  I_GET_TRACKED_HABITS_GRID_QUERY,
} from '../../../domain/ports/get-tracked-habits-grid-query.port';
import {
  IGetTrackedHabitsByDateAndUserIdQuery,
  I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY,
} from '../../../domain/ports/get-tracked-habits-by-date-and-user-id.port';
import { TrackedHabitAPI } from './tracked-habit.contract';
import { GetTrackedHabitsByDateAndUserIdPresenter } from './tracked-habit.presenter';
import { ZodValidationPipe } from '../../middlewares/pipes/zod-validation.pipe';
import { SessionGuard } from '../../middlewares/guards/session.guard';
import { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller()
export class TrackedHabitController {
  constructor(
    @Inject(I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY)
    private readonly getTrackedHabitsByDateAndUserId: IGetTrackedHabitsByDateAndUserIdQuery,
    private readonly getTrackedHabitsByDateAndUserIdPresenter: GetTrackedHabitsByDateAndUserIdPresenter,
    @Inject(I_GET_TRACKED_HABITS_GRID_QUERY)
    private readonly getTrackedHabitsGridQuery: IGetTrackedHabitsGridQuery,
  ) {}

  @UseGuards(SessionGuard)
  @Get('/tracked-habits')
  async handleGetTrackedHabitsByDateAndUserId(
    @Query(
      'date',
      new ZodValidationPipe(
        TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.dateQuery,
      ),
    )
    date: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.Response> {
    const trackedHabits = await this.getTrackedHabitsByDateAndUserId.execute({
      date,
      userId: req.user.props.id,
    });

    return this.getTrackedHabitsByDateAndUserIdPresenter.present(trackedHabits);
  }

  @UseGuards(SessionGuard)
  @Get('tracked-habits-grid')
  async handleGetTrackedHabitsGrid(
    @Query(
      'year',
      new ZodValidationPipe(
        TrackedHabitAPI.GetTrackedHabitsGrid.yearQueryParam,
      ),
    )
    year: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<TrackedHabitAPI.GetTrackedHabitsGrid.Response> {
    return await this.getTrackedHabitsGridQuery.execute({
      userId: req.user.props.id,
      year,
    });
  }
}
