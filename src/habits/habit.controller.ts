import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateAHabitToTrack } from './usecases/create-a-habit-to-track';
import { HabitAPI } from './contract';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';
import { CompleteHabit } from './usecases/complete-habit';
import { SessionGuard } from '../auth/session/session.guard';
import { User } from '../users/entities/user.entity';

@Controller()
export class HabitController {
  constructor(
    private readonly createAHabitToTrack: CreateAHabitToTrack,
    private readonly completeHabit: CompleteHabit,
  ) {}

  @UseGuards(SessionGuard)
  @Post('/habits')
  async handleCreateAHabitToTrack(
    @Body(new ZodValidationPipe(HabitAPI.CreateAHabitToTrack.schema))
    body: HabitAPI.CreateAHabitToTrack.Request,
    @Req() req: Request & { user: User },
  ) {
    return await this.createAHabitToTrack.execute({
      ...body,
      userId: req.user.props.id,
    });
  }

  @UseGuards(SessionGuard)
  @Post('/habits/:habitId/complete')
  async handleCompleteHabit(
    @Body(new ZodValidationPipe(HabitAPI.CompleteHabit.schema))
    body: HabitAPI.CompleteHabit.Request,
    @Param('habitId') habitId: string,
    @Req() req: Request & { user: User },
  ) {
    return await this.completeHabit.execute({
      ...body,
      habitId,
      user: req.user,
    });
  }
}
