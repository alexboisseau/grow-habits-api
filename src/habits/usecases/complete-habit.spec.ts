import { FixedDateGenerator } from '../../common/adapters/fixed-date-generator';
import { FixedIdGenerator } from '../../common/adapters/fixed-id-generator';
import { InMemoryHabitRepository } from '../adapters/in-memory-habit-repository';
import { InMemoryTrackedHabitRepository } from '../adapters/in-memory-tracked-repository';
import { Habit } from '../entities/habit.entity';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { CompleteHabit } from './complete-habit';

describe('Feature : complete a tracked habit', () => {
  const bob = {
    props: {
      id: 'bob',
    },
  };

  const habit = new Habit({
    id: 'id-1',
    userId: 'bob',
    trackedFrom: new Date('2023-01-01'),
    name: 'Brush my teeth',
    cue: 'After my breakfast',
    craving: 'Clean my teeth',
    response: 'Brush my teeth during three minutes',
    reward: 'Have a good feeling with fresh breath',
  });

  const uncompletedTrackedHabit = new TrackedHabit({
    date: '2023-01-02',
    habitId: 'id-1',
    id: 'id-1',
    status: 'TO_COMPLETE',
    userId: 'bob',
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
    habitRepository = new InMemoryHabitRepository([habit]);
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
          user: bob,
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
          habitId: 'id-1',
          date: '2023-01-03',
          user: bob,
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
          userId: 'bob',
        });
      });
    });
  });

  describe('Unhappy path', () => {
    describe('Scenario: complete tracked habit related to a non-existing habit', () => {
      it('should fail', async () => {
        const payload = {
          habitId: 'invalid-id',
          date: '2023-01-02',
          user: bob,
        };

        await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
          'Habit not found',
        );
      });
    });

    describe('Scenario: complete tracked habit in the future', () => {
      it('should fail', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: '2024-01-02',
          user: bob,
        };

        await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
          'Tracked habit date cannot be in the future',
        );
      });
    });

    describe('Scenario: complete tracked habit before the tracked from date', () => {
      it('should fail', async () => {
        const payload = {
          habitId: uncompletedTrackedHabit.props.habitId,
          date: '2022-12-31',
          user: bob,
        };

        await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
          "Completion date must be after the habit's start date.",
        );
      });
    });
  });
});
