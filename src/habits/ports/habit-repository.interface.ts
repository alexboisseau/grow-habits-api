import { Habit } from '../entities/habit.entity';

export interface IHabitRepository {
  create(habit: Habit): Promise<void>;
  findById(habitId: string): Promise<Habit | null>;
}
