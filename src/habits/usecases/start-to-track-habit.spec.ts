import { FixedDateGenerator } from '../adapters/fixed-date-generator';
import { FixedIdGenerator } from '../adapters/fixed-id-generator';
import { InMemoryHabitRepository } from '../adapters/in-memory-habit-repository';
import { StartToTrackHabit } from './start-to-track-habit';

describe('Feature : start to track a habit', () => {
  let habitRepository: InMemoryHabitRepository;
  let idGenerator: FixedIdGenerator;
  let dateGenerator: FixedDateGenerator;
  let useCase: StartToTrackHabit;

  beforeEach(() => {
    habitRepository = new InMemoryHabitRepository();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new StartToTrackHabit(
      habitRepository,
      idGenerator,
      dateGenerator,
    );
  });

  describe('Scenario : happy path', () => {
    const payload = {
      name: 'Brush my teeth',
      cue: 'After my breakfast',
      craving: 'Clean my teeth',
      response: 'Brush my teeth during three minutes',
      reward: 'Have a good feeling with fresh breath',
    };

    it('should create a new habit and return an id', async () => {
      const response = await useCase.execute(payload);

      expect(response).toEqual({
        id: 'id-1',
      });
    });

    it('should save the habit in the persistence layer', async () => {
      const response = await useCase.execute(payload);

      const savedHabit = await habitRepository.findById(response.id);

      expect(savedHabit).not.toBeNull();
    });

    it('should add a date field to know from when the user start to track the habit', async () => {
      const response = await useCase.execute(payload);

      const savedHabit = await habitRepository.findById(response.id);

      expect(savedHabit.trackedFrom).toEqual(dateGenerator.now());
    });
  });
});
