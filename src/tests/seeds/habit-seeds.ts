import { habitSeeds } from '../../application/usecases/tests/seeds/habit.seeds';
import { HabitFixture } from '../fixtures/habit-fixture';

export const e2eHabits = {
  makeMyBed: new HabitFixture(habitSeeds.makeMyBed),
};
