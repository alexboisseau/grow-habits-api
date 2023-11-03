import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Register } from './usecases/register';
import { UserAPI } from './contract';
import { Login } from './usecases/login';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';
import { Response } from 'express';

@Controller()
export class UserController {
  constructor(
    private readonly register: Register,
    private readonly login: Login,
  ) {}

  @Post('/users/register')
  async handleRegister(@Body() body: UserAPI.Register.Request) {
    return await this.register.execute({ ...body });
  }

  @HttpCode(200)
  @Post('/users/login')
  async handleLogin(
    @Body(new ZodValidationPipe(UserAPI.Login.schema))
    body: UserAPI.Login.Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { sessionId } = await this.login.execute({ ...body });
    response.cookie('sessionId', sessionId);
  }
}
