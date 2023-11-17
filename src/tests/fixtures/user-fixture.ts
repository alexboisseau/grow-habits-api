import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from '../../domain/ports/user-repository.port';

import { TestApp } from '../utils/test-app';
import { IFixture } from './fixture.interface';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}

  async load(app: TestApp) {
    const repository = app.get<IUserRepository>(I_USER_REPOSITORY);
    await repository.create(this.entity);
  }
}
