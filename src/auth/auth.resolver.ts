import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInResponse } from './dto/response/sign-in.response';
import { SignInInput } from './dto/input/sign-in.input';
import { AuthService } from './auth.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../constants/role.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Roles(Role.PUBLIC)
  @Mutation(() => SignInResponse)
  async signIn(
    @Args('signInData') signInData: SignInInput,
  ): Promise<SignInResponse> {
    return this.authService.signIn(signInData);
  }
}
