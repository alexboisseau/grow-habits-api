import { User } from '../../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../../domain/ports/user-repository.port';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    return this.database.find((user) => user.props.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.database.find((user) => user.props.email === email) ?? null;
  }

  async create(user: User): Promise<void> {
    this.database.push(user);
  }
}
