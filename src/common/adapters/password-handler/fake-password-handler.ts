import { IPasswordHandler } from '../../ports/password-handler.interface';

export class FakePasswordHandler implements IPasswordHandler {
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
