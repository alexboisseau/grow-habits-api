import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local/local.guard';

@Controller()
export class AuthController {
  @UseGuards(new LocalGuard())
  @Post('/login')
  async handleLogin(@Req() req: any) {
    return { msg: 'you are logged in' };
  }
}
