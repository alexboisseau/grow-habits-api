import { Body, Controller, Post } from '@nestjs/common';
import { Register } from './usecases/register';
import { UserAPI } from './contract';

@Controller()
export class UserController {
  constructor(private readonly register: Register) {}

  @Post('/users/register')
  async handleRegister(@Body() body: UserAPI.Register.Request) {
    return await this.register.execute({ ...body });
  }
}
