import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/dto/input/pagination.input';

@InputType()
export class GetCommentsInput extends PaginationInput {
  @Field(() => Int)
  photoId: number;
}
