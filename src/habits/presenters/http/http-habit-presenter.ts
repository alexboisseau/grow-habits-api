import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateHabitToTrack } from '../../usecases/create-habit-to-track';
import { HabitAPI } from '../../contract';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation.pipe';
import { UpdateTrackedHabitStatus } from '../../usecases/update-tracked-habit-status';
import { SessionGuard } from '../../../auth/session/session.guard';
import { User } from '../../../users/entities/user.entity';
import { HttpHabitExceptionsMapper } from './http-habit-exception-mapper';

@Controller()
export class HttpHabitPresenter {
  constructor(
    private readonly createHabitToTrack: CreateHabitToTrack,
    private readonly updateTrackedHabitStatus: UpdateTrackedHabitStatus,
    private readonly exceptionsMapper: HttpHabitExceptionsMapper,
  ) {}

  @UseGuards(SessionGuard)
  @Post('/habits')
  async handleCreateHabitToTrack(
    @Body(new ZodValidationPipe(HabitAPI.CreateHabitToTrack.schema))
    body: HabitAPI.CreateHabitToTrack.Request,
    @Req() req: Request & { user: User },
  ) {
    try {
      return await this.createHabitToTrack.execute({
        ...body,
        user: req.user,
      });
    } catch (error) {
      throw this.exceptionsMapper.map(error);
    }
  }

  @UseGuards(SessionGuard)
  @Post('/habits/:habitId/update-status')
  async handleUpdateTrackedHabitStatus(
    @Body(new ZodValidationPipe(HabitAPI.UpdateTrackedHabitStatus.schema))
    body: HabitAPI.UpdateTrackedHabitStatus.Request,
    @Param('habitId') habitId: string,
    @Req() req: Request & { user: User },
  ) {
    try {
      return await this.updateTrackedHabitStatus.execute({
        ...body,
        habitId,
        user: req.user,
      });
    } catch (error) {
      throw this.exceptionsMapper.map(error);
    }
  }
}
