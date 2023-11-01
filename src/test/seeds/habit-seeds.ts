import { Habit } from '../../habits/entities/habit.entity';
import { HabitFixture } from '../fixtures/habit-fixture';

export const e2eHabit = {
  makeMyBed: new HabitFixture(
    new Habit({
      id: 'id-1',
      userId: 'bob',
      trackedFrom: new Date('2023-01-01T00:00:00.000Z'),
      name: 'Make my bed',
      cue: 'When I wake up',
      craving: 'I want to start the day with a small win',
      response: 'I make my bed',
      reward: 'I feel good about myself',
    }),
  ),
};
