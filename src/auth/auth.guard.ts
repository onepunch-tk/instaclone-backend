import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const token = this.extractTokenFromHeader(ctx.getContext().req);
      if (!token) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload.authUser) {
        throw new UnauthorizedException('Invalid token');
      }
      ctx.getContext().authUser = payload.authUser;
    } catch (e) {
      const message = e.message;
      throw new UnauthorizedException(message && message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['authorization'];
  }
}
