import { PrismaService } from '../../../prisma/prisma.service';
import { TrackedHabit } from '../../entities/tracked-habit.entity';
import { ITrackedHabitRepository } from '../../ports/tracked-habit-repository.interface';
import { PrismaTrackedHabitMapper } from './prisma-tracked-habit-mapper';

export class PrismaTrackedHabitRepository implements ITrackedHabitRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaTrackedHabitMapper,
  ) {}

  async create(trackedHabit: TrackedHabit): Promise<void> {
    const trackedHabitToPersist = this.mapper.toPersistence(trackedHabit);

    await this.prisma.trackedHabit.create({
      data: {
        ...trackedHabitToPersist,
      },
    });
  }

  async findByHabitIdAndDate(
    trackedHabitId: string,
    date: string,
  ): Promise<TrackedHabit | null> {
    const trackedHabit = await this.prisma.trackedHabit.findUnique({
      where: { id: trackedHabitId, date },
    });

    if (!trackedHabit) return null;
    return this.mapper.toCore(trackedHabit);
  }

  async update(trackedHabit: TrackedHabit): Promise<void> {
    const trackedHabitToPersist = this.mapper.toPersistence(trackedHabit);

    await this.prisma.trackedHabit.update({
      where: { id: trackedHabitToPersist.id },
      data: {
        ...trackedHabitToPersist,
      },
    });

    trackedHabit.commit();
  }
}
