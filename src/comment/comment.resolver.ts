import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from '../common/decorators/roles.decorator';
import { GuardRole } from '../constants/role.enum';
import { CommentService } from './comment.service';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../common/models/user.model';
import { CreateCommentInput } from './dto/input/create-comment.input';
import { CreateCommentResponse } from './dto/response/create-comment.response';

@Roles(GuardRole.AUTH)
@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => CreateCommentResponse)
  async createComment(
    @AuthUser() authUser: User,
    @Args('createCommentData') createCommentData: CreateCommentInput,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(authUser, createCommentData);
  }
}
