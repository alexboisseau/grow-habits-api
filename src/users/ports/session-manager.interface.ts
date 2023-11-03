export const I_SESSION_MANAGER = 'I_SESSION_MANAGER';
export interface ISessionManager {
  createSession(userId: string): Promise<string>;
  deleteSession(sessionId: string): Promise<void>;
  getSession(sessionId: string): Promise<string | null>;
}
