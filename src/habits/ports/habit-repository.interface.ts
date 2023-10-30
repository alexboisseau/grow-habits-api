export interface IHabitRepository {
  create(payload: {
    id: string;
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
  }): Promise<void>;

  findById(habitId: string): Promise<{
    id: string;
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
  } | null>;
}
