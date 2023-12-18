import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Comment } from '../../../common/models/comment.model';

@InputType()
export class CreateCommentInput extends PickType(
  Comment,
  ['payload'] as const,
  InputType,
) {
  @Field(() => Int)
  photoId: number;
}
