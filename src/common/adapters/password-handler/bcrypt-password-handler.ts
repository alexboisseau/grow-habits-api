import { IPasswordHandler } from '../../ports/password-handler.interface';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHandler implements IPasswordHandler {
  async hash(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`);
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      throw new Error(`Error comparing password with hash: ${error.message}`);
    }
  }
}
