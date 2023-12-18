import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/graphql/input';

@InputType()
export class GetPhotoListInput extends PaginationInput {
  @Field(() => String)
  keyword: string;
}