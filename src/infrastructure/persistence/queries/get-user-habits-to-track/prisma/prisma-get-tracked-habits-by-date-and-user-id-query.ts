import { TrackedHabit } from '../../../../../domain/entities/tracked-habit.entity';
import { IGetTrackedHabitsByDateAndUserIdQuery } from '../../../../../domain/ports/get-tracked-habits-by-date-and-user-id.port';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaTrackedHabitMapper } from '../../../repositories/habit/prisma/prisma-tracked-habit.mapper';

type Request = {
  date: string;
  userId: string;
};

export class PrismaGetTrackedHabitsByDateAndUserIdQuery
  implements IGetTrackedHabitsByDateAndUserIdQuery
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly trackedHabitMapper: PrismaTrackedHabitMapper,
  ) {}

  async execute(request: Request): Promise<TrackedHabit[]> {
    const habits = await this.prisma.habit.findMany({
      where: {
        userId: request.userId,
        trackedFrom: {
          lte: new Date(request.date),
        },
      },
      include: {
        TrackedHabit: {
          where: {
            date: request.date,
          },
        },
      },
    });

    return habits.map((habit) => {
      const trackedHabit = habit.TrackedHabit[0];

      if (!trackedHabit) {
        return new TrackedHabit({
          id: '',
          date: request.date,
          status: 'TO_COMPLETE',
          habitId: habit.id,
          userId: request.userId,
        });
      }

      return this.trackedHabitMapper.toCore(trackedHabit);
    });
  }
}
