import request from 'supertest';

export type LoginParams = {
  agent: request.SuperAgentTest;
  email: string;
  password: string;
};

export async function login({ agent, email, password }: LoginParams) {
  await agent.post('/login').send({
    email,
    password,
  });
}
