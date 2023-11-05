import { User } from '../entities/user.entity';

export const userSeeds = {
  alice: new User({
    id: 'id-1',
    email: 'alice@gmail.com',
    password: 'hashed-Welcome@123',
  }),
  bob: new User({
    id: 'id-2',
    email: 'bob@gmail.com',
    password: 'hashed-azerty',
  }),
};
