import {
  Controller,
  Get,
  Inject,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../middlewares/pipes/zod-validation.pipe';
import { TrackedHabitAPI } from './tracked-habit.contract';
import {
  IGetTrackedHabitsByDateAndUserIdQuery,
  I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY,
} from '../../../domain/ports/get-tracked-habits-by-date-and-user-id.port';
import { GetTrackedHabitsByDateAndUserIdPresenter } from './tracked-habit.presenter';
import { SessionGuard } from '../../middlewares/guards/session.guard';
import { User } from '../../../domain/entities/user.entity';

@Controller()
export class TrackedHabitController {
  constructor(
    @Inject(I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY)
    private readonly getTrackedHabitsByDateAndUserId: IGetTrackedHabitsByDateAndUserIdQuery,
    private readonly getTrackedHabitsByDateAndUserIdPresenter: GetTrackedHabitsByDateAndUserIdPresenter,
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
    @Query(
      'userId',
      new ZodValidationPipe(
        TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.userIdQuery,
      ),
    )
    userId: string,
    @Req() req: Request & { user: User },
  ): Promise<TrackedHabitAPI.GetTrackedHabitsByDateAndUserId.Response> {
    if (req.user.props.id !== userId) {
      throw new UnauthorizedException();
    }

    const trackedHabits = await this.getTrackedHabitsByDateAndUserId.execute({
      date,
      userId,
    });

    return this.getTrackedHabitsByDateAndUserIdPresenter.present(trackedHabits);
  }
}
