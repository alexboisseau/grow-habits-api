import { TrackedHabitStatus } from '@prisma/client';
import { FixedDateGenerator } from '../../common/adapters/date-generator/fixed-date-generator';
import { FixedIdGenerator } from '../../common/adapters/id-generator/fixed-id-generator';
import { userSeeds } from '../../users/tests/user-seeds';
import { InMemoryHabitRepository } from '../adapters/in-memory-habit-repository';
import { InMemoryTrackedHabitRepository } from '../adapters/in-memory-tracked-repository';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { habitSeeds } from '../tests/habitSeeds';
import { CompleteHabit } from './complete-habit';
import { UnauthorizedException } from '../exceptions/unauthorized-access';
import { CompletionDateBeforeHabitsStartDateException } from '../exceptions/completion-date-before-habits-start-date';
import { TrackedHabitDateInFutureException } from '../exceptions/tracked-habit-date-in-future';
import { HabitNotFoundException } from '../exceptions/habit-not-found';

describe('Feature : update status to a tracked habit', () => {
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
  let useCase: CompleteHabit;

  beforeEach(() => {
    trackedHabitRepository = new InMemoryTrackedHabitRepository([
      uncompletedTrackedHabit,
    ]);
    habitRepository = new InMemoryHabitRepository([habitSeeds.makeMyBed]);
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new CompleteHabit(
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
          status: TrackedHabitStatus.COMPLETED,
          user: userSeeds.alice,
        };

        await useCase.execute({ ...payload });

        const trackedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.date,
        )) as TrackedHabit;

        expect(trackedHabit.props).toEqual({
          ...complitedTrackedHabit.props,
          status: TrackedHabitStatus.COMPLETED,
        });
        expect(trackedHabitRepository.count()).toEqual(1);
      });

      it('should cancel completion of the tracked habit', async () => {
        const payload = {
          habitId: complitedTrackedHabit.props.habitId,
          date: complitedTrackedHabit.props.date,
          status: TrackedHabitStatus.TO_COMPLETE,
          user: userSeeds.alice,
        };

        await useCase.execute({ ...payload });

        const trackedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.date,
        )) as TrackedHabit;

        expect(trackedHabit.props).toEqual({
          ...complitedTrackedHabit.props,
          status: TrackedHabitStatus.TO_COMPLETE,
        });
        expect(trackedHabitRepository.count()).toEqual(1);
      });
    });

    describe('Scenario: update status to tracked habit that does not exist', () => {
      it('should create new tracked habit with COMPLETED status', async () => {
        const payload = {
          habitId: habitSeeds.makeMyBed.props.id,
          date: '2023-01-03',
          status: TrackedHabitStatus.COMPLETED,
          user: userSeeds.alice,
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
          status: TrackedHabitStatus.COMPLETED,
          userId: userSeeds.alice.props.id,
        });
      });

      it('should create new tracked habit with TO_COMPLETE status', async () => {
        const payload = {
          habitId: habitSeeds.makeMyBed.props.id,
          date: '2023-01-03',
          status: TrackedHabitStatus.TO_COMPLETE,
          user: userSeeds.alice,
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
          status: TrackedHabitStatus.TO_COMPLETE,
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
          status: TrackedHabitStatus.COMPLETED,
          user: userSeeds.alice,
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
          status: TrackedHabitStatus.COMPLETED,
          user: userSeeds.alice,
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
          status: TrackedHabitStatus.COMPLETED,
          user: userSeeds.alice,
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
          status: TrackedHabitStatus.COMPLETED,
          user: userSeeds.bob,
        };

        await expect(() =>
          useCase.execute({ ...payload }),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });
});
