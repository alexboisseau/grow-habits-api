import { Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.isAuthenticated) return request.isAuthenticated();
    return false;
  }
}
