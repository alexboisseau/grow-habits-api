import { IGetTrackedHabitsByDateAndUserIdQueryResponse } from '../../../domain/ports/get-tracked-habits-by-date-and-user-id.port';

export class GetTrackedHabitsByDateAndUserIdPresenter {
  present(response: IGetTrackedHabitsByDateAndUserIdQueryResponse) {
    return response.map((trackedHabit) => ({
      id: trackedHabit.props.id,
      date: trackedHabit.props.date,
      status: trackedHabit.props.status,
      habitId: trackedHabit.props.habitId,
      userId: trackedHabit.props.userId,
    }));
  }
}
