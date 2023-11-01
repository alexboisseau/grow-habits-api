import { Habit } from '../entities/habit.entity';
import { IHabitRepository } from '../ports/habit-repository.interface';
import { IDateGenerator } from '../../common/ports/date-generator.interface';
import { IIdGenerator } from '../../common/ports/id-generator.interface';

type Request = {
  userId: string;
  name: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
};

type Response = {
  id: string;
};

export class CreateAHabitToTrack {
  constructor(
    private readonly habitRepository: IHabitRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  public async execute(request: Request): Promise<Response> {
    const id = this.idGenerator.generate();
    const trackedFrom = this.dateGenerator.currentDateAtMidnight();

    const habit = new Habit({
      id,
      ...request,
      trackedFrom,
    });

    await this.habitRepository.create(habit);
    return { id };
  }
}
