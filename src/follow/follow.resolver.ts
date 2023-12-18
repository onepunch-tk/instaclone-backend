import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FollowResponse } from './dto/reponse/follow.response';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../common/models/user.model';
import { FollowInput } from './dto/input/follow.input';
import { GetFollowResponse } from './dto/reponse/get-follow.response';
import { GetFollowInput } from './dto/input/get-follow.input';
import { FollowService } from './follow.service';
import { Follow } from '../common/models/follow.model';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';

@Roles(GuardRole.PUBLIC)
@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @ResolveField(() => Int)
  async followedByCount(@Parent() { id }) {
    return this.followService.followedByCount(id);
  }

  @ResolveField(() => Int)
  async followingCount(@Parent() { id }) {
    return this.followService.followingCount(id);
  }

  @ResolveField(() => Boolean)
  async isMe(@Parent() { id }: User, @Context() ctx: any) {
    const authUser = ctx.authUser;
    if (!authUser) return false;
    return id === authUser.id;
  }

  @Roles(GuardRole.AUTH)
  @Mutation(() => FollowResponse)
  async follow(
    @AuthUser() authUser: User,
    @Args('followData') followData: FollowInput,
  ): Promise<FollowResponse> {
    return this.followService.follow(authUser, followData);
  }

  @Query(() => GetFollowResponse)
  async getFollow(
    @AuthUser() authUser: User,
    @Args('getFollowData') getFollowData: GetFollowInput,
  ): Promise<GetFollowResponse> {
    return this.followService.getFollow(getFollowData);
  }
}
