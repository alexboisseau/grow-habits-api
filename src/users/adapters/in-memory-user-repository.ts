import { User } from '../entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private database: User[] = []) {}

  async create(user: User): Promise<void> {
    this.database.push(user);
  }
}
