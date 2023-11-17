import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { LocalGuard } from '../../middlewares/guards/local.guard';

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
