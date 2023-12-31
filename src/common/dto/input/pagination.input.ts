import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  afterId?: number;
  @Field(() => Int)
  pageSize: number;
}
