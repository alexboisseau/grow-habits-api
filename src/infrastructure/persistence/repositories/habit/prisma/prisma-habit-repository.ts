import { Habit } from '../../../../../domain/entities/habit.entity';
import { IHabitRepository } from '../../../../../domain/ports/habit-repository.port';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaHabitMapper } from './prisma-habit.mapper';

export class PrismaHabitRepository implements IHabitRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaHabitMapper,
  ) {}

  async create(habit: Habit): Promise<void> {
    const habitToPersist = this.mapper.toPersistence(habit);

    await this.prisma.habit.create({
      data: {
        ...habitToPersist,
      },
    });
  }

  async findById(habitId: string): Promise<Habit | null> {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) return null;
    return this.mapper.toCore(habit);
  }
}
