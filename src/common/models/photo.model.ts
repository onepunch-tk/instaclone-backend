import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Hashtag } from './hashtag.model';

@ObjectType()
export class Photo {
  @Field(() => Int)
  id: string;
  @Field(() => User)
  user: User;
  @Field(() => String)
  file: string;
  @Field(() => String, { nullable: true })
  caption?: string;
  @Field(() => [Hashtag], { nullable: true, defaultValue: [] })
  hashtags?: Hashtag[];
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
