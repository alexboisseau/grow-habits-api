import { IPasswordHasher } from '../ports/password-hasher.interface';

export class FakePasswordHasher implements IPasswordHasher {
  private hashCalls: string[] = [];

  async hash(password: string): Promise<string> {
    this.hashCalls.push(password);
    return `hashed-${password}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return `hashed-${password}` === hash;
  }

  getHashCalls(): string[] {
    return this.hashCalls;
  }
}
