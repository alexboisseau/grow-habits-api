import { FixedDateGenerator } from '../../common/adapters/date-generator/fixed-date-generator';
import { FixedIdGenerator } from '../../common/adapters/id-generator/fixed-id-generator';
import { userSeeds } from '../../users/tests/user-seeds';
import { InMemoryHabitRepository } from '../adapters/in-memory-habit-repository';
import { Habit } from '../entities/habit.entity';
import { CreateHabitToTrack } from './create-habit-to-track';

describe('Feature : create a habit to track', () => {
  function expectHabitToEqual(habit: Habit) {
    expect(habit.props).toEqual({
      id: 'id-1',
      userId: userSeeds.alice.props.id,
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
  let useCase: CreateHabitToTrack;

  beforeEach(() => {
    habitRepository = new InMemoryHabitRepository();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();
    useCase = new CreateHabitToTrack(
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
      user: userSeeds.alice,
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
