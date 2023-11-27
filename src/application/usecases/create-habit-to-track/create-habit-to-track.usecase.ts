import { Habit } from '../../../domain/entities/habit.entity';
import { User } from '../../../domain/entities/user.entity';
import { IDateGenerator } from '../../../domain/ports/date-generator.port';
import { IHabitRepository } from '../../../domain/ports/habit-repository.port';
import { IIdGenerator } from '../../../domain/ports/id-generator.port';
import { UseCase } from '../../shared/usecase';

type Request = {
  name: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
  user: User;
};

export type Response = Habit;

export class CreateHabitToTrack implements UseCase<Request, Response> {
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
    return habit;
  }
}
