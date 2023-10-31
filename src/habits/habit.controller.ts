import { Body, Controller, Post } from '@nestjs/common';
import { CreateAHabitToTrack } from './usecases/create-a-habit-to-track';
import { HabitAPI } from './contract';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';

@Controller()
export class HabitController {
  constructor(private readonly createAHabitToTrack: CreateAHabitToTrack) {}

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
}
