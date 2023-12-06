import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql/error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const token = this.extractTokenFromHeader(gqlCtx.req);
    // GraphQL 컨텍스트의 응답 객체
    if (!token) {
      gqlCtx.response = { test: 'kk' };
      throw new GraphQLError('Need Sign In', {
        extensions: {
          code: 'hoho',
        },
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload.authUser) {
        throw new UnauthorizedException('Invaild token');
      }
      gqlCtx.authUser = payload.authUser;
    } catch (e) {
      throw new GraphQLError(e.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['authorization'];
  }
}
