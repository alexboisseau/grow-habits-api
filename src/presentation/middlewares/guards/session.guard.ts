import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isAuthenticated = request.isAuthenticated();

    if (isAuthenticated === false) {
      throw new UnauthorizedException();
    }

    return isAuthenticated;
  }
}
