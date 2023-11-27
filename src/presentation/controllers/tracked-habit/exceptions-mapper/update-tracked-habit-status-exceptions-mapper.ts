import { HttpException, HttpStatus } from '@nestjs/common';
import { HabitNotFoundException } from '../../../../application/usecases/update-tracked-habit-status/exceptions/habit-not-found.exception';
import { CompletionDateBeforeHabitsStartDateException } from '../../../../application/usecases/update-tracked-habit-status/exceptions/completion-date-before-habits-start-date.exception';
import { TrackedHabitDateInFutureException } from '../../../../application/usecases/update-tracked-habit-status/exceptions/tracked-habit-date-in-future.exception';
import { ExceptionsMapper } from '../../../shared/exceptions-mapper';

export class UpdateTrackedHabitStatusExceptionsMapper extends ExceptionsMapper {
  map(error: Error) {
    if (error instanceof HabitNotFoundException) {
      return new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    if (error instanceof CompletionDateBeforeHabitsStartDateException) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    if (error instanceof TrackedHabitDateInFutureException) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return this.defaultException;
  }
}
