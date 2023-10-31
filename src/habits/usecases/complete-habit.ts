import { TrackedHabit } from '../entities/tracked-habit.entity';
import { ITrackedHabitRepository } from '../ports/tracked-habit-repository.interface';

type Request = {
  habitId: string;
  dateString: string;
};

export class CompleteHabit {
  constructor(
    private readonly trackedHabitRepository: ITrackedHabitRepository,
  ) {}

  async execute({ habitId, dateString }: Request): Promise<void> {
    await this.trackedHabitRepository.create(
      new TrackedHabit({
        date: dateString,
        habitId: habitId,
        id: 'tracked-habit-1',
        status: 'COMPLETED',
        userId: 'bob',
      }),
    );
  }
}
