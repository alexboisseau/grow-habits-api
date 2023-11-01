import { IDateGenerator } from '../../common/ports/date-generator.interface';
import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { Habit } from '../entities/habit.entity';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { CompletionDateBeforeHabitsStartDateException } from '../exceptions/completion-date-before-habits-start-date';
import { HabitNotFoundException } from '../exceptions/habit-not-found';
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

  async execute(request: Request): Promise<void> {
    const existingTrackedHabit =
      await this.trackedHabitRepository.findByHabitIdAndDate(
        request.habitId,
        request.date,
      );

    if (existingTrackedHabit) {
      await this.completeExistingTrackedHabit(existingTrackedHabit);
    } else {
      await this.createNewTrackedHabit(request);
    }
  }

  private async completeExistingTrackedHabit(
    trackedHabit: TrackedHabit,
  ): Promise<void> {
    trackedHabit.update({
      status: 'COMPLETED',
    });

    await this.trackedHabitRepository.update(trackedHabit);
  }

  private async createNewTrackedHabit({
    habitId,
    date,
    user,
  }: Request): Promise<void> {
    const newTrackedHabit = this.createTrackedHabit(
      habitId,
      date,
      user.props.id,
    );

    const habit = await this.habitRepository.findById(habitId);

    this.validateNewTrackedHabit(newTrackedHabit, habit);

    await this.trackedHabitRepository.create(newTrackedHabit);
  }

  private createTrackedHabit(
    habitId: string,
    date: string,
    userId: string,
  ): TrackedHabit {
    return new TrackedHabit({
      date,
      habitId,
      id: this.idGenerator.generate(),
      status: 'COMPLETED',
      userId,
    });
  }

  private validateNewTrackedHabit(
    newTrackedHabit: TrackedHabit,
    habit: Habit | null,
  ): void {
    if (newTrackedHabit.isInTheFuture(this.dateGenerator.now()))
      throw new TrackedHabitDateInFutureException();

    if (habit === null) throw new HabitNotFoundException();

    if (newTrackedHabit.isBeforeStartDate(habit.props.trackedFrom))
      throw new CompletionDateBeforeHabitsStartDateException();
  }
}
