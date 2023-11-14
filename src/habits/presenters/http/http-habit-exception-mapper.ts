import { HttpException, HttpStatus } from '@nestjs/common';
import { HabitNotFoundException } from '../../exceptions/habit-not-found';
import { CompletionDateBeforeHabitsStartDateException } from '../../exceptions/completion-date-before-habits-start-date';
import { TrackedHabitDateInFutureException } from '../../exceptions/tracked-habit-date-in-future';

export class HttpHabitExceptionsMapper {
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

    return new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
