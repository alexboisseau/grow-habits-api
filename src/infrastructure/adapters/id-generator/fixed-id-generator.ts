import { IIdGenerator } from '../../../domain/ports/id-generator.port';

export class FixedIdGenerator implements IIdGenerator {
  generate(): string {
    return 'id-1';
  }
}
