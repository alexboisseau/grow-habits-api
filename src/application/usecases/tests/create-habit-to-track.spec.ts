import { Habit } from '../../../domain/entities/habit.entity';
import { FixedDateGenerator } from '../../../infrastructure/adapters/date-generator/fixed-date-generator';
import { FixedIdGenerator } from '../../../infrastructure/adapters/id-generator/fixed-id-generator';
import { InMemoryHabitRepository } from '../../../infrastructure/persistence/repositories/habit/in-memory/in-memory-habit-repository';
import { CreateHabitToTrack } from '../create-habit-to-track/create-habit-to-track.usecase';
import { userSeeds } from './seeds/user.seeds';

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
      timezone: 'Europe/Paris',
    };

    it('should create a new habit and return an id', async () => {
      const response = await useCase.execute(payload);
      expectHabitToEqual(response);
    });

    it('should save the habit in the persistence layer', async () => {
      const response = await useCase.execute(payload);

      const savedHabit = (await habitRepository.findById(
        response.props.id,
      )) as Habit;

      expectHabitToEqual(savedHabit);
    });

    it('should add a date field to know from when the user start to track the habit', async () => {
      const response = await useCase.execute(payload);

      const savedHabit = (await habitRepository.findById(
        response.props.id,
      )) as Habit;

      expect(savedHabit.props.trackedFrom).toEqual(dateGenerator.now());
    });
  });
});
