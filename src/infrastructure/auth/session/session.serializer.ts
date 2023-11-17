import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { IUserRepository } from '../../../domain/ports/user-repository.port';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  serializeUser(user: User, done: (err: any, user: any) => void): any {
    done(null, { id: user.props.id });
  }

  async deserializeUser(payload: any, done: (err: any, payload: User) => void) {
    const user = (await this.userRepository.findById(payload.id)) as User;
    done(null, user);
  }
}
