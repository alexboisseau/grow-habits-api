import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local/local.guard';

@Controller()
export class AuthController {
  @UseGuards(new LocalGuard())
  @Post('/login')
  async handleLogin() {
    return { msg: 'you are logged in' };
  }
}
