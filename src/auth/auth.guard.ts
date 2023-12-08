import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql/error';
import { Reflector } from '@nestjs/core';
import { GuardRole } from '../constants/role.enum';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<GuardRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const token = this.extractTokenFromHeader(gqlCtx.req);

    // 토큰이 있으면 사용자 정보를 검증하고 설정하는 공통 로직
    if (token) {
      const payload = await this.verifyToken(token);
      if (payload && payload.authUser) {
        gqlCtx.authUser = payload.authUser;
      }
    }

    // PUBLIC 권한이 있으면 무조건 true 반환
    if (!requiredRoles || requiredRoles.includes(GuardRole.PUBLIC)) {
      return true;
    }

    // AUTH 권한이 있지만 유효한 사용자 정보가 없으면 오류 발생
    if (requiredRoles.includes(GuardRole.AUTH) && !gqlCtx.authUser) {
      throw new GraphQLError('Authentication required');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['authorization'];
  }

  // 토큰을 검증하는 별도의 메소드
  private async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      // 토큰 검증 실패시 null 반환
      return null;
    }
  }
}
