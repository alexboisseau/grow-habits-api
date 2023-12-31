import { IPasswordHasher } from '../../../domain/ports/password-hasher.port';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHasher implements IPasswordHasher {
  constructor(private readonly saltRounds: number) {}

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`);
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error(`Error comparing password with hash: ${error.message}`);
    }
  }
}
