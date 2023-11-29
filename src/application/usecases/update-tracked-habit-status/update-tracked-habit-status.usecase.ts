import { Habit } from '../../../domain/entities/habit.entity';
import {
  TrackedHabit,
  TrackedHabitStatus,
} from '../../../domain/entities/tracked-habit.entity';
import { User } from '../../../domain/entities/user.entity';
import { IDateGenerator } from '../../../domain/ports/date-generator.port';
import { IHabitRepository } from '../../../domain/ports/habit-repository.port';
import { IIdGenerator } from '../../../domain/ports/id-generator.port';
import { ITrackedHabitRepository } from '../../../domain/ports/tracked-habit-repository.port';
import { UseCase } from '../../shared/usecase';
import { CompletionDateBeforeHabitsStartDateException } from './exceptions/completion-date-before-habits-start-date.exception';
import { HabitNotFoundException } from './exceptions/habit-not-found.exception';
import { TrackedHabitDateInFutureException } from './exceptions/tracked-habit-date-in-future.exception';
import { UnauthorizedException } from './exceptions/unauthorized-access.exception';

type Request = {
  habitId: string;
  date: string;
  status: TrackedHabitStatus;
  timezone: string;
  user: User;
};

export type Response = TrackedHabit;

export class UpdateTrackedHabitStatus implements UseCase<Request, Response> {
  constructor(
    private readonly trackedHabitRepository: ITrackedHabitRepository,
    private readonly habitRepository: IHabitRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute(request: Request) {
    const existingTrackedHabit =
      await this.trackedHabitRepository.findByHabitIdAndDate(
        request.habitId,
        request.date,
      );

    if (existingTrackedHabit) {
      this.validateUserIsHabitOwner(
        existingTrackedHabit.props.userId,
        request.user.props.id,
      );

      await this.updateExistingTrackedHabitStatus(
        existingTrackedHabit,
        request.status,
      );

      return existingTrackedHabit;
    } else {
      return await this.createNewTrackedHabit(request);
    }
  }

  private async updateExistingTrackedHabitStatus(
    trackedHabit: TrackedHabit,
    status: TrackedHabitStatus,
  ): Promise<void> {
    trackedHabit.update({
      status,
    });

    await this.trackedHabitRepository.update(trackedHabit);
  }

  private async createNewTrackedHabit({
    habitId,
    date,
    user,
    timezone,
    status,
  }: Request): Promise<TrackedHabit> {
    const habit = await this.habitRepository.findById(habitId);

    const newTrackedHabit = new TrackedHabit({
      date,
      habitId,
      id: this.idGenerator.generate(),
      status,
      userId: user.props.id,
    });

    this.validateNewTrackedHabit(newTrackedHabit, habit, timezone);

    await this.trackedHabitRepository.create(newTrackedHabit);
    return newTrackedHabit;
  }

  private validateNewTrackedHabit(
    newTrackedHabit: TrackedHabit,
    habit: Habit | null,
    timezone: string,
  ): void {
    if (habit === null) throw new HabitNotFoundException();

    this.validateUserIsHabitOwner(
      habit.props.userId,
      newTrackedHabit.props.userId,
    );

    if (newTrackedHabit.isInTheFuture(this.dateGenerator.now(timezone)))
      throw new TrackedHabitDateInFutureException();

    if (newTrackedHabit.isBeforeStartDate(habit.props.trackedFrom))
      throw new CompletionDateBeforeHabitsStartDateException();
  }

  private validateUserIsHabitOwner(habitUserId: string, userId: string): void {
    if (habitUserId !== userId) {
      throw new UnauthorizedException();
    }
  }
}
