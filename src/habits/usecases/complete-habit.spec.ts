import { FixedDateGenerator } from '../../common/adapters/fixed-date-generator';
import { FixedIdGenerator } from '../../common/adapters/fixed-id-generator';
import { InMemoryTrackedHabitRepository } from '../adapters/in-memory-tracked-repository';
import { TrackedHabit } from '../entities/tracked-habit.entity';
import { CompleteHabit } from './complete-habit';

describe('Feature : complete a tracked habit', () => {
  const bob = {
    props: {
      id: 'bob',
    },
  };

  const uncompletedTrackedHabit = new TrackedHabit({
    date: '2023-09-21',
    habitId: 'id-1',
    id: 'id-1',
    status: 'TO_COMPLETE',
    userId: 'bob',
  });

  let trackedHabitRepository: InMemoryTrackedHabitRepository;
  let idGenerator: FixedIdGenerator;
  let dateGenerator: FixedDateGenerator;
  let useCase: CompleteHabit;

  beforeEach(() => {
    trackedHabitRepository = new InMemoryTrackedHabitRepository([
      uncompletedTrackedHabit,
    ]);
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new CompleteHabit(
      trackedHabitRepository,
      idGenerator,
      dateGenerator,
    );
  });

  describe('Scenario: tracked habit does not already exist', () => {
    const payload = {
      habitId: 'id-2',
      date: '2022-09-21',
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
        date: '2022-09-21',
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
      date: '2023-01-02',
      user: bob,
    };

    it('should fail', async () => {
      await expect(() => useCase.execute({ ...payload })).rejects.toThrow(
        'Tracked habit date cannot be in the future',
      );
    });
  });
});
