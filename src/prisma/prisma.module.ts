import { Module } from '@nestjs/common';
import { I_PRISMA_SERVICE, PrismaService } from './prisma.service';

@Module({
  providers: [
    {
      provide: I_PRISMA_SERVICE,
      useFactory: () => {
        return new PrismaService();
      },
    },
  ],
  exports: [I_PRISMA_SERVICE],
})
export class PrismaModule {}
