import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UserListInput {
  @Field(() => String)
  keyword: string;

  @Field(() => Int, { nullable: true })
  afterId?: number;
}
