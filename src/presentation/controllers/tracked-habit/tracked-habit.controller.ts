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
import { GetTrackedHabitsGridQueryExceptionsMapper } from './exceptions-mapper/get-tracked-habits-grid-query-exceptions-mapper';
import { GetTrackedHabitsByDateAndUserIdQueryExceptionsMapper } from './exceptions-mapper/get-tracked-habits-by-date-and-user-id-query-exceptions-mapper';

@Controller()
export class TrackedHabitController {
  constructor(
    @Inject(I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY)
    private readonly getTrackedHabitsByDateAndUserId: IGetTrackedHabitsByDateAndUserIdQuery,
    private readonly getTrackedHabitsByDateAndUserIdPresenter: GetTrackedHabitsByDateAndUserIdPresenter,
    private readonly getTrackedHabitsByDateAndUserIdQueryExceptionsMapper: GetTrackedHabitsByDateAndUserIdQueryExceptionsMapper,
    @Inject(I_GET_TRACKED_HABITS_GRID_QUERY)
    private readonly getTrackedHabitsGridQuery: IGetTrackedHabitsGridQuery,
    private readonly getTrackedHabitsGridQueryExceptionsMapper: GetTrackedHabitsGridQueryExceptionsMapper,
  ) {}

  @UseGuards(SessionGuard)
  @Get('tracked-habits')
  async handleGetTrackedHabitsByDateAndUserId(
    @Query(
      new ZodValidationPipe(
        TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.requestSchema,
      ),
    )
    query: TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.Request,
    @Req() req: AuthenticatedRequest,
  ): Promise<TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.Response> {
    try {
      const trackedHabits = await this.getTrackedHabitsByDateAndUserId.execute({
        ...query,
        userId: req.user.props.id,
      });

      return this.getTrackedHabitsByDateAndUserIdPresenter.present(
        trackedHabits,
      );
    } catch (error) {
      throw this.getTrackedHabitsByDateAndUserIdQueryExceptionsMapper.map(
        error,
      );
    }
  }

  @UseGuards(SessionGuard)
  @Get('tracked-habits-grid')
  async handleGetTrackedHabitsGrid(
    @Query(
      new ZodValidationPipe(TrackedHabitAPI.GetTrackedHabitsGrid.requestSchema),
    )
    query: TrackedHabitAPI.GetTrackedHabitsGrid.Request,
    @Req() req: AuthenticatedRequest,
  ): Promise<TrackedHabitAPI.GetTrackedHabitsGrid.Response> {
    try {
      return await this.getTrackedHabitsGridQuery.execute({
        year: parseInt(query.year),
        userId: req.user.props.id,
      });
    } catch (error) {
      throw this.getTrackedHabitsGridQueryExceptionsMapper.map(error);
    }
  }
}
