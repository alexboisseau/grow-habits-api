import { Habit } from '../entities/habit.entity';
import { IDateGenerator } from '../ports/date-generator.interface';
import { IHabitRepository } from '../ports/habit-repository.interface';
import { IIdGenerator } from '../ports/id-generator.interface';

type Request = {
  name: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
};

type Response = {
  id: string;
};

export class StartToTrackHabit {
  constructor(
    private readonly habitRepository: IHabitRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  public async execute(request: Request): Promise<Response> {
    const id = this.idGenerator.generate();
    const trackedFrom = this.dateGenerator.now();

    const habit = new Habit({
      id,
      ...request,
      trackedFrom,
    });

    await this.habitRepository.create(habit);
    return { id };
  }
}
