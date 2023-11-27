import { Response as CreateHabitToTrackResponse } from '../../../application/usecases/create-habit-to-track/create-habit-to-track.usecase';
import { HabitAPI } from './habit.contract';

export class HabitPresenter {
  public presentCreateHabitToTrackResponse(
    response: CreateHabitToTrackResponse,
  ): HabitAPI.CreateHabitToTrack.Response {
    return {
      id: response.props.id,
      name: response.props.name,
      cue: response.props.cue,
      craving: response.props.craving,
      response: response.props.response,
      reward: response.props.reward,
      trackedFrom: response.props.trackedFrom,
      userId: response.props.userId,
    };
  }
}
