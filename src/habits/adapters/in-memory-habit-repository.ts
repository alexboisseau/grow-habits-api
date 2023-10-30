import { Habit } from '../entities/habit.entity';
import { IHabitRepository } from '../ports/habit-repository.interface';

export class InMemoryHabitRepository implements IHabitRepository {
  private database: Array<Habit> = [];

  async create(habit: Habit): Promise<void> {
    this.database.push(habit);
  }

  async findById(habitId: string): Promise<Habit | null> {
    return this.database.find((habit) => habit.props.id === habitId) ?? null;
  }
}
