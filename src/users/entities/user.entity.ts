export type UserProps = {
  id: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export class User {
  constructor(public props: UserProps) {}
}
