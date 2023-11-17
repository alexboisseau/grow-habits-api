import { Habit as PrismaHabit } from '@prisma/client';
import { Habit } from '../../../../../domain/entities/habit.entity';

export class PrismaHabitMapper {
  toCore(prismaHabit: PrismaHabit): Habit {
    return new Habit({
      id: prismaHabit.id,
      craving: prismaHabit.craving,
      cue: prismaHabit.cue,
      name: prismaHabit.name,
      response: prismaHabit.response,
      reward: prismaHabit.reward,
      trackedFrom: prismaHabit.trackedFrom,
      userId: prismaHabit.userId,
    });
  }

  toPersistence(habit: Habit): PrismaHabit {
    return {
      id: habit.props.id,
      craving: habit.props.craving,
      cue: habit.props.cue,
      name: habit.props.name,
      response: habit.props.response,
      reward: habit.props.reward,
      trackedFrom: habit.props.trackedFrom,
      userId: habit.props.userId,
    };
  }
}
