import { TrackedHabit } from '../entities/tracked-habit.entity';

export const I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY =
  'I_GET_TRACKED_HABITS_BY_DATE_AND_USER_ID_QUERY';

export type IGetTrackedHabitsByDateAndUserIdQueryRequest = {
  date: string;
  userId: string;
};

export type IGetTrackedHabitsByDateAndUserIdQueryResponse = TrackedHabit[];

export interface IGetTrackedHabitsByDateAndUserIdQuery {
  execute(
    request: IGetTrackedHabitsByDateAndUserIdQueryRequest,
  ): Promise<IGetTrackedHabitsByDateAndUserIdQueryResponse>;
}
