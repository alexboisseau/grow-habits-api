import { TrackedHabit as PrismaTrackedHabit } from '@prisma/client';
import { TrackedHabit } from '../../entities/tracked-habit.entity';

export class PrismaTrackedHabitMapper {
  toCore(prismaTrackedHabit: PrismaTrackedHabit): TrackedHabit {
    return new TrackedHabit({
      id: prismaTrackedHabit.id,
      date: prismaTrackedHabit.date,
      habitId: prismaTrackedHabit.habitId,
      status: prismaTrackedHabit.status,
      userId: prismaTrackedHabit.userId,
    });
  }

  toPersistence(trackedHabit: TrackedHabit): PrismaTrackedHabit {
    return {
      id: trackedHabit.props.id,
      date: trackedHabit.props.date,
      habitId: trackedHabit.props.habitId,
      status: trackedHabit.props.status,
      userId: trackedHabit.props.userId,
    };
  }
}
