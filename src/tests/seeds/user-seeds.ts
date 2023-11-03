import { User } from '../../users/entities/user.entity';
import { UserFixture } from '../fixtures/user-fixture';

export const e2eUser = {
  alice: new UserFixture(
    new User({
      id: 'id-1',
      email: 'alice@gmail.com',
      password: 'hashed-Welcome@123',
    }),
  ),
  bob: new UserFixture(
    new User({
      id: 'id-2',
      email: 'bob@gmail.com',
      password: 'hashed-Welcome@123',
    }),
  ),
};
