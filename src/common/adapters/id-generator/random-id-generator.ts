import { IIdGenerator } from '../../ports/id-generator.interface';

export class RandomIdGenerator implements IIdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
