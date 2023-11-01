import { TestApp } from '../utils/test-app';

export interface IFixture {
  load(app: TestApp): Promise<void>;
}
