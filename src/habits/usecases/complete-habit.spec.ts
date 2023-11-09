import { FixedDateGenerator } from '../../common/adapters/date-generator/fixed-date-generator';
import { FixedIdGenerator } from '../../common/adapters/id-generator/fixed-id-generator';
import { userSeeds } from '../../users/tests/user-seeds';
import { InMemoryHabitRepository } from '../adapters/in-memory-habit-repository';
import { InMemoryTrackedHabitRepository } from '../adapters/in-memory-tracked-repository';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { habitSeeds } from '../tests/habitSeeds';
import { CompleteHabit } from './complete-habit';

describe('Feature : complete a tracked habit', () => {
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
    describe('Scenario: tracked habit does already exist', () => {
      it('should complete the tracked habit', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: uncompletedTrackedHabit.props.date,
          user: userSeeds.alice,
        };

        await useCase.execute({ ...payload });

        const trackedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.date,
        )) as TrackedHabit;

        expect(trackedHabit.props).toEqual({
          ...uncompletedTrackedHabit.props,
          status: 'COMPLETED',
        });
        expect(trackedHabitRepository.count()).toEqual(1);
      });
    });

    describe('Scenario: tracked habit does not already exist', () => {
      it('should create and complete the tracked habit', async () => {
        const payload = {
          habitId: habitSeeds.makeMyBed.props.id,
          date: '2023-01-03',
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
          status: 'COMPLETED',
          userId: userSeeds.alice.props.id,
        });
      });
    });
  });

  describe('Unhappy path', () => {
    it('should fail if tracked habit related to a non-existing habit', async () => {
      const payload = {
        habitId: 'invalid-id',
        date: '2023-01-02',
        user: userSeeds.alice,
      };

      await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
        'Habit not found',
      );
    });

    it('should fail if tracked habit is in the future', async () => {
      const payload = {
        habitId: uncompletedTrackedHabit.props.habitId,
        date: '2024-01-02',
        user: userSeeds.alice,
      };

      await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
        'Tracked habit date cannot be in the future',
      );
    });

    it('should fail if tracked habit is before the started habit date', async () => {
      const payload = {
        habitId: uncompletedTrackedHabit.props.habitId,
        date: '2022-12-31',
        user: userSeeds.alice,
      };

      await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
        "Completion date must be after the habit's start date.",
      );
    });
  });
});
