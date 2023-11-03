import { ISessionManager } from '../ports/session-manager.interface';

type Request = {
  email: string;
  password: string;
};

type Response = {
  sessionId: string;
};

export class Login {
  constructor(private readonly sessionManager: ISessionManager) {}

  async execute(request: Request): Promise<Response> {
    const sessionId = await this.sessionManager.createSession('id-1');

    return {
      sessionId,
    };
  }
}
