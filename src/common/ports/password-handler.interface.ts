export const I_PASSWORD_HANDLER = 'I_PASSWORD_HANDLER';
export interface IPasswordHandler {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
