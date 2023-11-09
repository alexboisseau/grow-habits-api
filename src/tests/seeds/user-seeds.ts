import { hashSync } from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { UserFixture } from '../fixtures/user-fixture';

export const e2eUsers = {
  alice: new UserFixture(
    new User({
      id: 'id-1',
      email: 'alice@gmail.com',
      password: hashSync('Welcome@123', 10),
    }),
  ),
  bob: new UserFixture(
    new User({
      id: 'id-2',
      email: 'bob@gmail.com',
      password: hashSync('azerty', 10),
    }),
  ),
};
