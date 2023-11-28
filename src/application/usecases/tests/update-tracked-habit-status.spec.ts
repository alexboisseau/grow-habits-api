import {
  TrackedHabit,
  TrackedHabitStatus,
} from '../../../domain/entities/tracked-habit.entity';
import { FixedDateGenerator } from '../../../infrastructure/adapters/date-generator/fixed-date-generator';
import { FixedIdGenerator } from '../../../infrastructure/adapters/id-generator/fixed-id-generator';
import { InMemoryHabitRepository } from '../../../infrastructure/persistence/repositories/habit/in-memory/in-memory-habit-repository';
import { InMemoryTrackedHabitRepository } from '../../../infrastructure/persistence/repositories/habit/in-memory/in-memory-tracked-repository';
import { CompletionDateBeforeHabitsStartDateException } from '../update-tracked-habit-status/exceptions/completion-date-before-habits-start-date.exception';
import { HabitNotFoundException } from '../update-tracked-habit-status/exceptions/habit-not-found.exception';
import { TrackedHabitDateInFutureException } from '../update-tracked-habit-status/exceptions/tracked-habit-date-in-future.exception';
import { UnauthorizedException } from '../update-tracked-habit-status/exceptions/unauthorized-access.exception';
import { UpdateTrackedHabitStatus } from '../update-tracked-habit-status/update-tracked-habit-status.usecase';
import { habitSeeds } from './seeds/habit.seeds';
import { userSeeds } from './seeds/user.seeds';

describe('Feature : update tracked habit status', () => {
  const complitedTrackedHabit = new TrackedHabit({
    date: '2023-01-02',
    habitId: habitSeeds.makeMyBed.props.id,
    id: 'id-1',
    status: 'COMPLETED',
    userId: userSeeds.alice.props.id,
  });

  const uncompletedTrackedHabit = new TrackedHabit({
    date: '2023-01-02',
    habitId: habitSeeds.makeMyBed.props.id,
    id: 'id-1',
    status: 'TO_COMPLETE',
    userId: userSeeds.alice.props.id,
  });

  let trackedHabitRepository: InMemoryTrackedHabitRepository;
  let habitRepository: InMemoryHabitRepository;
  let idGenerator: FixedIdGenerator;
  let dateGenerator: FixedDateGenerator;
  let useCase: UpdateTrackedHabitStatus;

  beforeEach(() => {
    trackedHabitRepository = new InMemoryTrackedHabitRepository([
      uncompletedTrackedHabit,
    ]);
    habitRepository = new InMemoryHabitRepository([habitSeeds.makeMyBed]);
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new UpdateTrackedHabitStatus(
      trackedHabitRepository,
      habitRepository,
      idGenerator,
      dateGenerator,
    );
  });

  describe('Happy path', () => {
    describe('Scenario: update status to tracked habit that already exists', () => {
      it('should complete the tracked habit', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: uncompletedTrackedHabit.props.date,
          status: 'COMPLETED' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await useCase.execute({ ...payload });

        const trackedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.date,
        )) as TrackedHabit;

        expect(trackedHabit.props).toEqual({
          ...complitedTrackedHabit.props,
          status: 'COMPLETED' as TrackedHabitStatus,
        });
        expect(trackedHabitRepository.count()).toEqual(1);
      });

      it('should cancel completion of the tracked habit', async () => {
        const payload = {
          habitId: complitedTrackedHabit.props.habitId,
          date: complitedTrackedHabit.props.date,
          status: 'TO_COMPLETE' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await useCase.execute({ ...payload });

        const trackedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.date,
        )) as TrackedHabit;

        expect(trackedHabit.props).toEqual({
          ...complitedTrackedHabit.props,
          status: 'TO_COMPLETE' as TrackedHabitStatus,
        });
        expect(trackedHabitRepository.count()).toEqual(1);
      });
    });

    describe('Scenario: update status to tracked habit that does not exist', () => {
      it('should create new tracked habit with COMPLETED status', async () => {
        const payload = {
          habitId: habitSeeds.makeMyBed.props.id,
          date: '2023-01-03',
          status: 'COMPLETED' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await useCase.execute({
          ...payload,
        });

        const createdTrackHabit =
          (await trackedHabitRepository.findByHabitIdAndDate(
            payload.habitId,
            payload.date,
          )) as TrackedHabit;

        expect(createdTrackHabit).not.toBeNull();
        expect(createdTrackHabit.props).toEqual({
          date: '2023-01-03',
          habitId: payload.habitId,
          id: 'id-1',
          status: 'COMPLETED' as TrackedHabitStatus,
          userId: userSeeds.alice.props.id,
        });
      });

      it('should create new tracked habit with TO_COMPLETE status', async () => {
        const payload = {
          habitId: habitSeeds.makeMyBed.props.id,
          date: '2023-01-03',
          status: 'TO_COMPLETE' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await useCase.execute({
          ...payload,
        });

        const createdTrackHabit =
          (await trackedHabitRepository.findByHabitIdAndDate(
            payload.habitId,
            payload.date,
          )) as TrackedHabit;

        expect(createdTrackHabit).not.toBeNull();
        expect(createdTrackHabit.props).toEqual({
          date: '2023-01-03',
          habitId: payload.habitId,
          id: 'id-1',
          status: 'TO_COMPLETE' as TrackedHabitStatus,
          userId: userSeeds.alice.props.id,
        });
      });
    });
  });

  describe('Unhappy path', () => {
    describe('Scenario: tracked habit related to a non-existing habit', () => {
      it('should fail', async () => {
        const payload = {
          habitId: 'invalid-id',
          date: '2023-01-02',
          status: 'COMPLETED' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
          HabitNotFoundException,
        );
      });
    });

    describe('Scenario: tracked habit is in the future', () => {
      it('should fail', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: '2024-01-02',
          status: 'COMPLETED' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
          TrackedHabitDateInFutureException,
        );
      });
    });

    describe('Scenario: tracked habit is before the started habit date', () => {
      it('should fail ', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: '2022-12-31',
          status: 'COMPLETED' as TrackedHabitStatus,
          user: userSeeds.alice,
          timezone: 'Europe/Paris',
        };

        await expect(() =>
          useCase.execute({ ...payload }),
        ).rejects.toThrowError(CompletionDateBeforeHabitsStartDateException);
      });
    });

    describe('Scenario: user is not the owner of the habit', () => {
      it('should fail', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: uncompletedTrackedHabit.props.date,
          status: 'COMPLETED' as TrackedHabitStatus,
          user: userSeeds.bob,
          timezone: 'Europe/Paris',
        };

        await expect(() =>
          useCase.execute({ ...payload }),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });
});
