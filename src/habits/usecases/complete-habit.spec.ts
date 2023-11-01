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

  describe('Scenario: tracked habit does not already exist', () => {
    const payload = {
      habitId: 'id-1',
      date: '2023-01-03',
      user: bob,
    };

    it('should create and complete the tracked habit', async () => {
      await useCase.execute({
        ...payload,
      });

      const createdTrackHabit =
        (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.date,
        ))!;

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

  describe('Scenario: tracked habit does already exist', () => {
    const payload = {
      habitId: uncompletedTrackedHabit.props.habitId,
      date: uncompletedTrackedHabit.props.date,
      user: bob,
    };

    it('should create and complete the tracked habit', async () => {
      await useCase.execute({ ...payload });

      const trackedHabit = (await trackedHabitRepository.findByHabitIdAndDate(
        payload.habitId,
        payload.date,
      ))!;

      expect(trackedHabit.props).toEqual({
        date: uncompletedTrackedHabit.props.date,
        habitId: uncompletedTrackedHabit.props.habitId,
        id: uncompletedTrackedHabit.props.id,
        status: 'COMPLETED',
        userId: uncompletedTrackedHabit.props.userId,
      });
      expect(trackedHabitRepository.count()).toEqual(1);
    });
  });

  describe('Scenario: complete tracked habit in the future', () => {
    const payload = {
      habitId: uncompletedTrackedHabit.props.habitId,
      date: '2024-01-02',
      user: bob,
    };

    it('should fail', async () => {
      await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
        'Tracked habit date cannot be in the future',
      );
    });
  });

  describe('Scenario: complete tracked habit before the tracked from date', () => {
    const payload = {
      habitId: habit.props.id,
      date: '2022-12-31',
      user: bob,
    };

    it('should fail', async () => {
      await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
        "Completion date must be after the habit's start date.",
      );
    });
  });
});
