import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateAccountInput } from './dto/input/create-account.input';
import { UserResponse } from './dto/reponse/user.response';
import { ProfileArgs } from './dto/args/profile.args';
import { EditProfileInput } from './dto/input/edit-profile.input';
import { EditProfileResponse } from './dto/reponse/edit-profile.response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../models/user.model';
import { AuthUser } from '../decorators/auth.decorator';

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

  @Mutation(() => EditProfileResponse)
  @UseGuards(AuthGuard)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('editProfileData') editProfileData: EditProfileInput,
  ): Promise<EditProfileResponse> {
    return this.userService.editProfile(authUser.id, editProfileData);
  }
}
