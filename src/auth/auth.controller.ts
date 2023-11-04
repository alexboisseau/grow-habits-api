import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local/local.guard';
import { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  @UseGuards(LocalGuard)
  @Post('/login')
  async handleLogin(@Req() req: Request & { user: User }) {
    return {
      user: {
        id: req.user.props.id,
        email: req.user.props.email,
      },
    };
  }
}
