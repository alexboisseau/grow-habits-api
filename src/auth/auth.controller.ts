import { Controller, Post } from '@nestjs/common';

@Controller()
export class AuthController {
  @Post('/login')
  async handleLogin() {
    return { msg: 'you are logged in' };
  }
}
