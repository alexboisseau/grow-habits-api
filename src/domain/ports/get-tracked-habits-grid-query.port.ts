export const I_GET_TRACKED_HABIT_GRID_QUERY = 'I_GET_TRACKED_HABIT_GRID_QUERY';

export type IGetTrackedHabitsGridQueryRequest = {
  date: string;
  userId: string;
};

export type IGetTrackedHabitsGridQueryResponse = Array<{
  date: Date;
  trackedHabitsCount: number;
  completedTrackedHabitsCount: number;
  uncompletedTrackedHabitsCount: number;
}>;

export interface IGetTrackedHabitsGridQuery {
  execute(
    request: IGetTrackedHabitsGridQueryRequest,
  ): Promise<IGetTrackedHabitsGridQueryResponse>;
}
