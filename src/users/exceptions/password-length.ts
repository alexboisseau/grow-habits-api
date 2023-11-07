export class PasswordLengthException extends Error {
  constructor() {
    super('Password length must be greater than or equal to 8');
  }
}
