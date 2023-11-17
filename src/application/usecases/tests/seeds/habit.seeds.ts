import { Habit } from '../../../../domain/entities/habit.entity';
import { userSeeds } from './user.seeds';

export const habitSeeds = {
  makeMyBed: new Habit({
    id: 'id-1',
    userId: userSeeds.alice.props.id,
    trackedFrom: new Date('2023-01-01T00:00:00.000Z'),
    name: 'Make my bed',
    cue: 'When I wake up',
    craving: 'I want to start the day with a small win',
    response: 'I make my bed',
    reward: 'I feel good about myself',
  }),
};
