import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from '../../middlewares/guards/local.guard';
import { AuthenticatedRequest } from '../../shared/authenticated-request';
import { LoginPresenter } from './auth.presenter';

@Controller()
export class AuthController {
  constructor(private readonly loginPresenter: LoginPresenter) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  async handleLogin(@Req() req: AuthenticatedRequest) {
    return this.loginPresenter.present(req);
  }
}
