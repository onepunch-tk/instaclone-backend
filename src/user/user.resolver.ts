import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateAccountInput } from './dto/input/create-account.input';
import { UserResponse } from './dto/reponse/user.response';
import { ProfileArgs } from './dto/args/profile.args';
import { SigninResponse } from './dto/reponse/signin.response';
import { SigninInput } from './dto/input/signin.input';
import { EditProfileInput } from './dto/input/edit-profile.input';
import { EditProfileResponse } from './dto/reponse/edit-profile.response';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  async seeProfile(@Args() username: ProfileArgs) {
    return this.userService.seeProfile(username);
  }

  @Mutation(() => UserResponse)
  async createAccount(
    @Args('createAccountData') createAccountData: CreateAccountInput,
  ): Promise<UserResponse> {
    return this.userService.createAccount(createAccountData);
  }

  @Mutation(() => SigninResponse)
  async signin(
    @Args('signinData') signinData: SigninInput,
  ): Promise<SigninResponse> {
    return this.userService.signin(signinData);
  }

  @Mutation(() => EditProfileResponse)
  async editProfile(
    @Args('editProfileData') editProfileData: EditProfileInput,
  ): Promise<EditProfileResponse> {
    console.log(editProfileData);
    return { success: true };
  }
}
