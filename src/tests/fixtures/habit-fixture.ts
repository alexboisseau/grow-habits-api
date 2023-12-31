import { Habit } from '../../domain/entities/habit.entity';
import {
  IHabitRepository,
  I_HABIT_REPOSITORY,
} from '../../domain/ports/habit-repository.port';
import { TestApp } from '../utils/test-app';
import { IFixture } from './fixture.interface';

export class HabitFixture implements IFixture {
  constructor(public entity: Habit) {}

  async load(app: TestApp) {
    const repository = app.get<IHabitRepository>(I_HABIT_REPOSITORY);
    await repository.create(this.entity);
  }
}
