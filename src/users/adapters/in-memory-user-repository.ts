import { User } from '../entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    return this.database.find((user) => user.props.id === id) ?? null;
  }

  async create(user: User): Promise<void> {
    this.database.push(user);
  }
}
