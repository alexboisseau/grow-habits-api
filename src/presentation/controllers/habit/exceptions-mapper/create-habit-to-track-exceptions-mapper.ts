import { HttpException, HttpStatus } from '@nestjs/common';
import { IExceptionsMapper } from '../../../shared/exceptions-mapper';

export class CreateHabitToTrackExceptionsMapper implements IExceptionsMapper {
  map(error: Error) {
    return new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
