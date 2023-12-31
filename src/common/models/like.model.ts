import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
