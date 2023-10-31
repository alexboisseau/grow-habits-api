import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { ITrackedHabitRepository } from '../ports/tracked-habit-repository.interface';

type Request = {
  habitId: string;
  date: string;
  user: {
    props: { id: string };
  };
};

export class CompleteHabit {
  constructor(
    private readonly trackedHabitRepository: ITrackedHabitRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute({ habitId, date, user }: Request): Promise<void> {
    const existingTrackedHabit =
      await this.trackedHabitRepository.findByHabitIdAndDate(habitId, date);

    if (existingTrackedHabit === null) {
      const id = this.idGenerator.generate();

      await this.trackedHabitRepository.create(
        new TrackedHabit({
          date,
          habitId,
          id,
          status: 'COMPLETED',
          userId: user.props.id,
        }),
      );
    } else {
      existingTrackedHabit.update({
        status: 'COMPLETED',
      });

      await this.trackedHabitRepository.update(existingTrackedHabit);
    }
  }
}
