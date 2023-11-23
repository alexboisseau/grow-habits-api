import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from '../../middlewares/guards/local.guard';
import { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller()
export class AuthController {
  @UseGuards(LocalGuard)
  @Post('/login')
  async handleLogin(@Req() req: AuthenticatedRequest) {
    return {
      user: {
        id: req.user.props.id,
        email: req.user.props.email,
      },
    };
  }
}
