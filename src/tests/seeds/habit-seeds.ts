import { habitSeeds } from '../../habits/tests/habitSeeds';
import { HabitFixture } from '../fixtures/habit-fixture';

export const e2eHabits = {
  makeMyBed: new HabitFixture(habitSeeds.makeMyBed),
};
