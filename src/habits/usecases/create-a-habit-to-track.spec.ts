import { FixedDateGenerator } from '../../common/adapters/fixed-date-generator';
import { FixedIdGenerator } from '../../common/adapters/fixed-id-generator';
import { InMemoryHabitRepository } from '../adapters/in-memory-habit-repository';
import { Habit } from '../entities/habit.entity';
import { CreateAHabitToTrack } from './create-a-habit-to-track';

describe('Feature : create a habit to track', () => {
  function expectHabitToEqual(habit: Habit) {
    expect(habit.props).toEqual({
      id: 'id-1',
      userId: 'bob',
      trackedFrom: dateGenerator.now(),
      name: 'Brush my teeth',
      cue: 'After my breakfast',
      craving: 'Clean my teeth',
      response: 'Brush my teeth during three minutes',
      reward: 'Have a good feeling with fresh breath',
    });
  }

  let habitRepository: InMemoryHabitRepository;
  let idGenerator: FixedIdGenerator;
  let dateGenerator: FixedDateGenerator;
  let useCase: CreateAHabitToTrack;

  beforeEach(() => {
    habitRepository = new InMemoryHabitRepository();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new CreateAHabitToTrack(
      habitRepository,
      idGenerator,
      dateGenerator,
    );
  });

  describe('Happy path', () => {
    const payload = {
      name: 'Brush my teeth',
      cue: 'After my breakfast',
      craving: 'Clean my teeth',
      response: 'Brush my teeth during three minutes',
      reward: 'Have a good feeling with fresh breath',
      userId: 'bob',
    };

    it('should create a new habit and return an id', async () => {
      const response = await useCase.execute(payload);

      expect(response.id).toEqual('id-1');
    });

    it('should save the habit in the persistence layer', async () => {
      const response = await useCase.execute(payload);

      const savedHabit = (await habitRepository.findById(response.id)) as Habit;

      expectHabitToEqual(savedHabit);
    });

    it('should add a date field to know from when the user start to track the habit', async () => {
      const response = await useCase.execute(payload);

      const savedHabit = (await habitRepository.findById(response.id)) as Habit;

      expect(savedHabit.props.trackedFrom).toEqual(dateGenerator.now());
    });
  });
});
