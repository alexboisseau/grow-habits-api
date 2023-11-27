import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateHabitToTrack } from '../../../application/usecases/create-habit-to-track/create-habit-to-track.usecase';
import { UpdateTrackedHabitStatus } from '../../../application/usecases/update-tracked-habit-status/update-tracked-habit-status.usecase';
import { SessionGuard } from '../../middlewares/guards/session.guard';
import { ZodValidationPipe } from '../../middlewares/pipes/zod-validation.pipe';
import { HabitAPI } from './habit.contract';
import { CreateHabitToTrackExceptionsMapper } from './exceptions-mapper/create-habit-to-track-exceptions-mapper';
import { UpdateTrackedHabitStatusExceptionsMapper } from './exceptions-mapper/update-tracked-habit-status-exceptions-mapper';
import { AuthenticatedRequest } from '../../shared/authenticated-request';
import { HabitPresenter } from './habit.presenter';

@Controller()
export class HabitController {
  constructor(
    private readonly createHabitToTrack: CreateHabitToTrack,
    private readonly updateTrackedHabitStatus: UpdateTrackedHabitStatus,
    private readonly createHabitToTrackExceptionsMapper: CreateHabitToTrackExceptionsMapper,
    private readonly updateTrackedHabitStatusExceptionsMapper: UpdateTrackedHabitStatusExceptionsMapper,
    private readonly presenter: HabitPresenter,
  ) {}

  @UseGuards(SessionGuard)
  @Post('/habits')
  async handleCreateHabitToTrack(
    @Body(new ZodValidationPipe(HabitAPI.CreateHabitToTrack.schema))
    body: HabitAPI.CreateHabitToTrack.Request,
    @Req() req: AuthenticatedRequest,
  ): Promise<HabitAPI.CreateHabitToTrack.Response> {
    try {
      const response = await this.createHabitToTrack.execute({
        ...body,
        user: req.user,
      });

      return this.presenter.presentCreateHabitToTrackResponse(response);
    } catch (error) {
      throw this.createHabitToTrackExceptionsMapper.map(error);
    }
  }

  @UseGuards(SessionGuard)
  @Post('/habits/:habitId/update-status')
  async handleUpdateTrackedHabitStatus(
    @Body(new ZodValidationPipe(HabitAPI.UpdateTrackedHabitStatus.schema))
    body: HabitAPI.UpdateTrackedHabitStatus.Request,
    @Param('habitId') habitId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      return await this.updateTrackedHabitStatus.execute({
        ...body,
        habitId,
        user: req.user,
      });
    } catch (error) {
      throw this.updateTrackedHabitStatusExceptionsMapper.map(error);
    }
  }
}
