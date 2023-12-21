import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateAccountInput } from './dto/input/create-account.input';
import { UserResponse } from './dto/reponse/user.response';
import { GetUserInput } from './dto/input/get-user.input';
import { EditProfileInput } from './dto/input/edit-profile.input';
import { EditProfileResponse } from './dto/reponse/edit-profile.response';
import { User } from '../common/models/user.model';
import { AuthUser } from '../common/decorators/auth.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { UserListResponse } from './dto/reponse/user-list.response';
import { GetUserListInput } from './dto/input/get-user-list.input';
import { Photo } from '../common/models/photo.model';
import { PaginationInput } from '../common/dto/input/pagination.input';
import { PhotoLoader } from '../common/loaders/photo.loader';
import { BatchUserPhotosArgs } from '../common/loaders/photo.loader.type';

@Roles(GuardRole.PUBLIC)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly photoLoader: PhotoLoader,
  ) {}

  @ResolveField(() => [Photo])
  async photos(
    @Parent() { id },
    @Args('paginationData') paginationData: PaginationInput,
  ) {
    const batchLoadArgs: BatchUserPhotosArgs = {
      userIds: [id],
      paginationData,
    };

    return this.photoLoader.batchPhotos.load(batchLoadArgs);
  }

  @ResolveField(() => Boolean)
  async isMe(@Parent() { id }: User, @Context() ctx: any) {
    const authUser = ctx.authUser;
    if (!authUser) return false;
    return id === authUser.id;
  }

  @ResolveField(() => Boolean)
  async isFollowing(@Parent() { id }, @Context() ctx: any) {
    const authUser = ctx.authUser;
    if (!authUser) return false;

    return this.userService.getIsFollowing(id, authUser.id);
  }

  @Query(() => UserResponse)
  async getProfile(@Args('getUserData') getUserData: GetUserInput) {
    return this.userService.getProfile(getUserData);
  }

  @Query(() => UserListResponse)
  async getUserList(@Args('userListData') userListData: GetUserListInput) {
    return this.userService.getUserList(userListData);
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
