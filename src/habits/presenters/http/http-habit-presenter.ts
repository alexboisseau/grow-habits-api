import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateHabitToTrack } from '../../usecases/create-habit-to-track';
import { HabitAPI } from '../../contract';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation.pipe';
import { CompleteHabit } from '../../usecases/complete-habit';
import { SessionGuard } from '../../../auth/session/session.guard';
import { User } from '../../../users/entities/user.entity';
import { HttpHabitExceptionsMapper } from './http-habit-exception-mapper';

@Controller()
export class HttpHabitPresenter {
  constructor(
    private readonly createHabitToTrack: CreateHabitToTrack,
    private readonly completeHabit: CompleteHabit,
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
        userId: req.user.props.id,
      });
    } catch (error) {
      throw this.exceptionsMapper.map(error);
    }
  }

  @UseGuards(SessionGuard)
  @Post('/habits/:habitId/complete')
  async handleCompleteHabit(
    @Body(new ZodValidationPipe(HabitAPI.CompleteHabit.schema))
    body: HabitAPI.CompleteHabit.Request,
    @Param('habitId') habitId: string,
    @Req() req: Request & { user: User },
  ) {
    try {
      return await this.completeHabit.execute({
        ...body,
        habitId,
        user: req.user,
      });
    } catch (error) {
      throw this.exceptionsMapper.map(error);
    }
  }
}
