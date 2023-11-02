import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../core/app.module';
import { IFixture } from '../fixtures/fixture.interface';

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();
  }

  async cleanUp() {
    await this.app.close();
  }

  get<T>(name: any) {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  async loadFixtures(fixtures: IFixture[]) {
    return await Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }
}
