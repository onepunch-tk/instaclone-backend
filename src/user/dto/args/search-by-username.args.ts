import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SearchByUsernameArgs {
  @Field(() => String)
  username: string;

  @Field(() => Int, { nullable: true })
  afterId?: number;
}
