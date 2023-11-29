import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateHabitToTrack } from '../../../application/usecases/create-habit-to-track/create-habit-to-track.usecase';
import { SessionGuard } from '../../middlewares/guards/session.guard';
import { ZodValidationPipe } from '../../middlewares/pipes/zod-validation.pipe';
import { HabitAPI } from './habit.contract';
import { CreateHabitToTrackExceptionsMapper } from './exceptions-mapper/create-habit-to-track-exceptions-mapper';
import { AuthenticatedRequest } from '../../shared/authenticated-request';
import { HabitPresenter } from './habit.presenter';
import { RequestHeaders } from '../../middlewares/decorators/request-headers.decorator';

@Controller()
export class HabitController {
  constructor(
    private readonly createHabitToTrack: CreateHabitToTrack,
    private readonly createHabitToTrackExceptionsMapper: CreateHabitToTrackExceptionsMapper,
    private readonly presenter: HabitPresenter,
  ) {}

  @UseGuards(SessionGuard)
  @Post('/habits')
  async handleCreateHabitToTrack(
    @Body(new ZodValidationPipe(HabitAPI.CreateHabitToTrack.schema))
    body: HabitAPI.CreateHabitToTrack.Request,
    @Req() req: AuthenticatedRequest,
    @RequestHeaders(
      new ZodValidationPipe(HabitAPI.CreateHabitToTrack.headersSchema),
    )
    { 'x-timezone': timezone }: HabitAPI.CreateHabitToTrack.RequestHeaders,
  ): Promise<HabitAPI.CreateHabitToTrack.Response> {
    try {
      const response = await this.createHabitToTrack.execute({
        ...body,
        user: req.user,
        timezone,
      });

      return this.presenter.presentCreateHabitToTrackResponse(response);
    } catch (error) {
      throw this.createHabitToTrackExceptionsMapper.map(error);
    }
  }
}
