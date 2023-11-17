export const I_PASSWORD_HASHER = 'I_PASSWORD_HASHER';
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
