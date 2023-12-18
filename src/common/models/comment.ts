import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  payload: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isMine?: boolean;
  @Field(() => Date)
  updatedAt: Date;
}
