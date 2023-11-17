import { PrismaClient } from '@prisma/client';
import { PrismaUserMapper } from './prisma-user.mapper';
import { IUserRepository } from '../../../../../domain/ports/user-repository.port';
import { User } from '../../../../../domain/entities/user.entity';

export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mapper: PrismaUserMapper,
  ) {}

  async create(user: User): Promise<void> {
    const userToPersist = this.mapper.toPersistence(user);
    await this.prisma.user.create({
      data: userToPersist,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;
    return this.mapper.toCore(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;
    return this.mapper.toCore(user);
  }
}
