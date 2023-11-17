import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../../../domain/entities/user.entity';

export class PrismaUserMapper {
  toCore(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
    });
  }

  toPersistence(user: User): PrismaUser {
    return {
      id: user.props.id,
      email: user.props.email,
      password: user.props.password,
    };
  }
}
