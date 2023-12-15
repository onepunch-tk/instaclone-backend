import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateAccountInput } from './dto/input/create-account.input';
import { UserResponse } from './dto/reponse/user.response';
import { SearchByUsernameArgs } from './dto/args/search-by-username.args';
import { EditProfileInput } from './dto/input/edit-profile.input';
import { EditProfileResponse } from './dto/reponse/edit-profile.response';
import { User } from '../common/models/user.model';
import { AuthUser } from '../common/decorators/auth.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { UserListResponse } from './dto/reponse/user-list.response';
import { UserListInput } from './dto/input/user-list.input';
import { Photo } from '../common/models/photo.model';
import { PaginationInput } from '../common/graphql/input';
import { Hashtag } from '../common/models/hashtag.model';

@Roles(GuardRole.PUBLIC)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField(() => [Photo])
  async photos(
    @Parent() { id }: Hashtag,
    @Args('photoPaginationData') photoPaginationData: PaginationInput,
  ) {
    return this.userService.getPhotos(id, photoPaginationData);
  }

  @Query(() => UserResponse)
  async seeProfile(@Args() searchArgs: SearchByUsernameArgs) {
    return this.userService.seeProfile(searchArgs);
  }

  @Query(() => UserListResponse)
  async seeUserList(@Args('userListData') userListData: UserListInput) {
    return this.userService.seeUserList(userListData);
  }
  @Mutation(() => UserResponse)
  async createAccount(
    @Args('createAccountData') createAccountData: CreateAccountInput,
  ): Promise<UserResponse> {
    return this.userService.createAccount(createAccountData);
  }

  @Roles(GuardRole.AUTH)
  @Mutation(() => EditProfileResponse)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('editProfileData') editProfileData: EditProfileInput,
  ): Promise<EditProfileResponse> {
    return this.userService.editProfile(authUser, editProfileData);
  }
}
