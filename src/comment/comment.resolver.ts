import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { CommentService } from './comment.service';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../common/models/user.model';
import { CreateCommentInput } from './dto/input/create-comment.input';
import { CreateCommentResponse } from './dto/response/create-comment.response';
import { GetCommentsInput } from './dto/input/get-comments.input';
import { GetCommentsResponse } from './dto/response/get-comments.response';
import { Comment } from '../common/models/comment.model';

@Roles(GuardRole.AUTH)
@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @ResolveField(() => Boolean)
  async isMine(@Parent() { userId }: Comment, @Context() ctx) {
    const authUser = ctx.authUser;
    if (!authUser) return false;

    return userId === authUser.id;
  }

  @Mutation(() => CreateCommentResponse)
  async createComment(
    @AuthUser() authUser: User,
    @Args('createCommentData') createCommentData: CreateCommentInput,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(authUser, createCommentData);
  }

  @Roles(GuardRole.PUBLIC)
  @Query(() => GetCommentsResponse)
  async getCommentsByPhotoId(
    @Args('getCommentsData') getCommentsData: GetCommentsInput,
  ): Promise<GetCommentsResponse> {
    return this.commentService.getCommentsByPhotoId(getCommentsData);
  }
}
