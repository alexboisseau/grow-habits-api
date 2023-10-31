import { IIdGenerator } from '../ports/id-generator.interface';

export class FixedIdGenerator implements IIdGenerator {
  generate(): string {
    return 'id-1';
  }
}
