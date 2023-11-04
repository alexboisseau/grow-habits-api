import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local/local.guard';
import { SessionGuard } from './session/session.guard';

@Controller()
export class AuthController {
  @UseGuards(LocalGuard)
  @Post('/login')
  async handleLogin(@Req() req: any) {
    return { msg: 'you are logged in' };
  }

  @UseGuards(SessionGuard)
  @Get('/protected')
  async handleProtected(@Req() req: any) {
    return { msg: 'you are authorized', user: req.user };
  }
}
