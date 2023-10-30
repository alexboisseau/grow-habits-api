import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Feature : create a habit to track', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('Scenario : happy path', () => {
    it('should create the new habit', async () => {
      const payload = {
        name: 'Brush my teeth',
        cue: 'After my breakfast',
        craving: 'Clean my teeth',
        response: 'Brush my teeth during three minutes',
        reward: 'Have a good feeling with fresh breath',
        userId: 'bob',
      };

      const result = await request(app.getHttpServer())
        .post('/habits')
        .send(payload);

      expect(result.status).toEqual(201);
    });
  });
});
