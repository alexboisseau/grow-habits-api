import { InMemoryTrackedHabitRepository } from '../adapters/in-memory-tracked-repository';
import { CompleteHabit } from './complete-habit';

describe('Feature : complete a habit', () => {
  let trackedHabitRepository: InMemoryTrackedHabitRepository;
  let useCase: CompleteHabit;

  beforeEach(() => {
    trackedHabitRepository = new InMemoryTrackedHabitRepository([]);
    useCase = new CompleteHabit(trackedHabitRepository);
  });

  describe('Scenario: tracked habit does not already exist', () => {
    const payload = {
      habitId: 'habit-2',
      dateString: '2023-09-22',
    };

    it('should create and complete the habit', async () => {
      await useCase.execute({ ...payload });

      const createdTrackHabit =
        (await trackedHabitRepository.findByHabitIdAndDate(
          payload.habitId,
          payload.dateString,
        ))!;

      expect(createdTrackHabit).not.toBeNull();
      expect(createdTrackHabit.props).toEqual({
        date: '2023-09-22',
        habitId: payload.habitId,
        id: 'tracked-habit-1',
        status: 'COMPLETED',
        userId: 'bob',
      });
    });
  });
});
