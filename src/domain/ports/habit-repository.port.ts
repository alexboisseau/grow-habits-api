import { Habit } from '../entities/habit.entity';

export const I_HABIT_REPOSITORY = 'I_HABIT_REPOSITORY';
export interface IHabitRepository {
  create(habit: Habit): Promise<void>;
  findById(habitId: string): Promise<Habit | null>;
}
