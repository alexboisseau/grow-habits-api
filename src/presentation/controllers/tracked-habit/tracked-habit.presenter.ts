import { IGetTrackedHabitsByDateAndUserIdQueryResponse } from '../../../domain/ports/get-tracked-habits-by-date-and-user-id.port';
import { Response as UpdateTrackedHabitStatusResponse } from '../../../application/usecases/update-tracked-habit-status/update-tracked-habit-status.usecase';

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

export class UpdateTrackedHabitStatusPresenter {
  present(response: UpdateTrackedHabitStatusResponse) {
    return {
      id: response.props.id,
      date: response.props.date,
      status: response.props.status,
      habitId: response.props.habitId,
      userId: response.props.userId,
    };
  }
}
