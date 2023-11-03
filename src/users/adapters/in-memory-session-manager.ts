import { ISessionManager } from '../ports/session-manager.interface';

export class InMemorySessionManager implements ISessionManager {
  private readonly sessions = new Map<string, string>();

  async createSession(userId: string) {
    const sessionId = Math.random().toString(36).slice(2);
    this.sessions.set(sessionId, userId);
    return sessionId;
  }

  async deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  async getSession(sessionId: string): Promise<string | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  getSessionSync(sessionId: string): string | null {
    return this.sessions.get(sessionId) ?? null;
  }
}
