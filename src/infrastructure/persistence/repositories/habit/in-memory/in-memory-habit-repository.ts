import { Habit } from '../../../../../domain/entities/habit.entity';
import { IHabitRepository } from '../../../../../domain/ports/habit-repository.port';

export class InMemoryHabitRepository implements IHabitRepository {
  constructor(private database: Array<Habit> = []) {}

  async create(habit: Habit): Promise<void> {
    this.database.push(habit);
  }

  async findById(habitId: string): Promise<Habit | null> {
    return this.database.find((habit) => habit.props.id === habitId) ?? null;
  }

  async findAllByUserId(userId: string): Promise<Habit[]> {
    return this.database.filter((habit) => habit.props.userId === userId);
  }
}
