import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignedUrl {
  @Field(() => String)
  signedUrl: string;
}
