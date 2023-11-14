export type UserProps = {
  id: string;
  email: string;
  password: string;
};

export class User {
  constructor(public props: UserProps) {}
}

export const USER_EMAIL_MAX_LENGTH = 255;
export const USER_PASSWORD_MIN_LENGTH = 8;
export const USER_PASSWORD_MAX_LENGTH = 255;
