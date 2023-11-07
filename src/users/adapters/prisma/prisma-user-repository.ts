import { PrismaClient } from '@prisma/client';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../ports/user-repository.interface';
import { PrismaUserMapper } from './prisma-user-mapper';

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
