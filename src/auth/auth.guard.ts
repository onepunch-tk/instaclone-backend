import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql/error';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/role.enum';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRoles && requiredRoles.includes(Role.PUBLIC)) {
      return true;
    }
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
