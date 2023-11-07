export class EmailFormatException extends Error {
  constructor() {
    super('Invalid email format');
  }
}
