import {
  Body,
  Controller,
  Get,
  Inject,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateTrackedHabitStatus } from '../../../application/usecases/update-tracked-habit-status/update-tracked-habit-status.usecase';
import { UpdateTrackedHabitStatusExceptionsMapper } from './exceptions-mapper/update-tracked-habit-status-exceptions-mapper';
import { RequestHeaders } from '../../middlewares/decorators/request-headers.decorator';

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
    private readonly updateTrackedHabitStatus: UpdateTrackedHabitStatus,
    private readonly updateTrackedHabitStatusExceptionsMapper: UpdateTrackedHabitStatusExceptionsMapper,
  ) {}

  @UseGuards(SessionGuard)
  @Get('/tracked-habits')
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
  @Get('/tracked-habits-grid')
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

  @UseGuards(SessionGuard)
  @Put('/tracked-habits/update-status')
  async handleUpdateTrackedHabitStatus(
    @Body(
      new ZodValidationPipe(TrackedHabitAPI.UpdateTrackedHabitStatus.schema),
    )
    body: TrackedHabitAPI.UpdateTrackedHabitStatus.Request,
    @Req() req: AuthenticatedRequest,
    @RequestHeaders(
      new ZodValidationPipe(
        TrackedHabitAPI.UpdateTrackedHabitStatus.headersSchema,
      ),
    )
    {
      'x-timezone': timezone,
    }: TrackedHabitAPI.UpdateTrackedHabitStatus.RequestHeaders,
  ) {
    try {
      return await this.updateTrackedHabitStatus.execute({
        ...body,
        user: req.user,
        timezone,
      });
    } catch (error) {
      throw this.updateTrackedHabitStatusExceptionsMapper.map(error);
    }
  }
}
