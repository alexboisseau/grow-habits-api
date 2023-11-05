import { userSeeds } from '../../users/tests/user-seeds';
import { UserFixture } from '../fixtures/user-fixture';

export const e2eUsers = {
  alice: new UserFixture(userSeeds.alice),
  bob: new UserFixture(userSeeds.bob),
};
