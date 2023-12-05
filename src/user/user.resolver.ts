import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UserResponse } from './dto/reponse/user.response';
import { ProfileArgs } from './dto/args/profile.args';
import { SigninResponse } from './dto/reponse/signin.response';
import { SigninInput } from './dto/input/signin.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  async seeProfile(@Args() username: ProfileArgs) {
    return this.userService.seeProfile(username);
  }

  @Mutation(() => UserResponse)
  async createAccount(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<UserResponse> {
    return this.userService.createAccount(createUserData);
  }

  @Mutation(() => SigninResponse)
  async signin(
    @Args('signinData') signinData: SigninInput,
  ): Promise<SigninResponse> {
    return this.userService.signin(signinData);
  }
}
