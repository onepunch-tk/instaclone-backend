import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/dto/input';

@InputType()
export class GetUserListInput extends PaginationInput {
  @Field(() => String)
  keyword: string;
}
