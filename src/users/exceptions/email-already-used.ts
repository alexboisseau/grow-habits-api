export class EmailAlreadyUsedException extends Error {
  constructor() {
    super('Email already used');
  }
}
