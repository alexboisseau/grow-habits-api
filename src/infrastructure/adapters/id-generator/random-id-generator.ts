import { IIdGenerator } from '../../../domain/ports/id-generator.port';

export class RandomIdGenerator implements IIdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
