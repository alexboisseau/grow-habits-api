export class ConfirmPasswordException extends Error {
  constructor() {
    super("Password and confirm password fields don't match");
  }
}
