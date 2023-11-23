export const I_GET_TRACKED_HABITS_GRID_QUERY =
  'I_GET_TRACKED_HABITS_GRID_QUERY';

export type IGetTrackedHabitsGridQueryRequest = {
  year: number;
  userId: string;
};

export type IGetTrackedHabitsGridQueryResponse = Array<{
  date: Date;
  completedTrackedHabitsCount: number;
  uncompletedTrackedHabitsCount: number;
  habitsCount: number;
}>;

export interface IGetTrackedHabitsGridQuery {
  execute(
    request: IGetTrackedHabitsGridQueryRequest,
  ): Promise<IGetTrackedHabitsGridQueryResponse>;
}
