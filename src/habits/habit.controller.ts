import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateAHabitToTrack } from './usecases/create-a-habit-to-track';
import { HabitAPI } from './contract';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';
import { CompleteHabit } from './usecases/complete-habit';

@Controller()
export class HabitController {
  constructor(
    private readonly createAHabitToTrack: CreateAHabitToTrack,
    private readonly completeHabit: CompleteHabit,
  ) {}

  @Post('/habits')
  async handleCreateAHabitToTrack(
    @Body(new ZodValidationPipe(HabitAPI.CreateAHabitToTrack.schema))
    body: HabitAPI.CreateAHabitToTrack.Request,
  ) {
    return await this.createAHabitToTrack.execute({
      ...body,
      userId: 'bob',
    });
  }

  @Post('/habits/:habitId/complete')
  async handleCompleteHabit(
    @Body(new ZodValidationPipe(HabitAPI.CompleteHabit.schema))
    body: HabitAPI.CompleteHabit.Request,
    @Param('habitId') habitId: string,
  ) {
    return await this.completeHabit.execute({
      ...body,
      habitId,
      user: {
        props: {
          id: 'bob',
        },
      },
    });
  }
}
