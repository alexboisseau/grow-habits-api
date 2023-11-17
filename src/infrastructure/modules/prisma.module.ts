import { Module } from '@nestjs/common';
import {
  PRISMA_SERVICE,
  PrismaService,
} from '../persistence/prisma/prisma.service';

@Module({
  providers: [
    {
      provide: PRISMA_SERVICE,
      useFactory: () => {
        return new PrismaService();
      },
    },
  ],
  exports: [PRISMA_SERVICE],
})
export class PrismaModule {}
