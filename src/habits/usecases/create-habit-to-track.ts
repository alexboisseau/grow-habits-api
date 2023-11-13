import { Habit } from '../entities/habit.entity';
import { IHabitRepository } from '../ports/habit-repository.interface';
import { IDateGenerator } from '../../common/ports/date-generator.interface';
import { IIdGenerator } from '../../common/ports/id-generator.interface';
import { User } from '../../users/entities/user.entity';

type Request = {
  name: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
  user: User;
};

type Response = {
  id: string;
};

export class CreateHabitToTrack {
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
      name: request.name,
      cue: request.cue,
      craving: request.craving,
      response: request.response,
      reward: request.reward,
      trackedFrom,
      userId: request.user.props.id,
    });

    await this.habitRepository.create(habit);
    return { id };
  }
}
