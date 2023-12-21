import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Error {
  @Field(() => String)
  message: string;
}
