import { IHabitRepository } from '../ports/habit-repository.interface';

export class InMemoryHabitRepository implements IHabitRepository {
  private database: Array<{
    id: string;
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
  }> = [];

  async create(payload: {
    id: string;
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
  }): Promise<void> {
    this.database.push(payload);
  }

  async findById(habitId: string): Promise<{
    id: string;
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
  } | null> {
    return this.database.find((habit) => habit.id === habitId) ?? null;
  }
}
