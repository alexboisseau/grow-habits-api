import { IDateGenerator } from '../ports/date-generator.interface';
import { IHabitRepository } from '../ports/habit-repository.interface';
import { IIdGenerator } from '../ports/id-generator.interface';

export class StartToTrackHabit {
  constructor(
    private readonly habitRepository: IHabitRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  public async execute(payload: {
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
  }): Promise<{
    id: string;
  }> {
    const id = this.idGenerator.generate();
    const trackedFrom = this.dateGenerator.now();
    await this.habitRepository.create({
      id,
      ...payload,
      trackedFrom,
    });

    return { id };
  }
}
