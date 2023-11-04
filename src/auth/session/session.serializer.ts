import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { IUserRepository } from '../../users/ports/user-repository.interface';

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
