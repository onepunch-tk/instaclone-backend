import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ProfileArgs {
  @Field(() => String)
  username: string;
}
