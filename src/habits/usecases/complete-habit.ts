import { IDateGenerator } from '../../common/ports/date-generator.interface';
import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { TrackedHabitDateInFutureException } from '../exceptions/tracked-habit-date-in-future';
import { IHabitRepository } from '../ports/habit-repository.interface';
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
    private readonly habitRepository: IHabitRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute({ habitId, date, user }: Request): Promise<void> {
    const existingTrackedHabit =
      await this.trackedHabitRepository.findByHabitIdAndDate(habitId, date);

    if (existingTrackedHabit === null) {
      const id = this.idGenerator.generate();

      const newTrackedHabit = new TrackedHabit({
        date,
        habitId,
        id,
        status: 'COMPLETED',
        userId: user.props.id,
      });

      if (newTrackedHabit.isInTheFuture(this.dateGenerator.now()))
        throw new TrackedHabitDateInFutureException();

      const habit = (await this.habitRepository.findById(habitId))!;

      if (newTrackedHabit.isBeforeStartDate(habit.props.trackedFrom)) {
        throw new Error(
          "Completion date must be after the habit's start date.",
        );
      }

      await this.trackedHabitRepository.create(newTrackedHabit);
    } else {
      existingTrackedHabit.update({
        status: 'COMPLETED',
      });

      await this.trackedHabitRepository.update(existingTrackedHabit);
    }
  }
}
