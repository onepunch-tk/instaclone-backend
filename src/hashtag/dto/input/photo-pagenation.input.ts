import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PhotoPaginationInput {
  @Field(() => Int, { nullable: true })
  afterId?: number;
  @Field(() => Int)
  pageSize: number;
}
