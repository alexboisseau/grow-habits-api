import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestHeaders = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    console.log('Decorator');
    return ctx.switchToHttp().getRequest().headers;
  },
);
