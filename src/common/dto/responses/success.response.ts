import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Success {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}
