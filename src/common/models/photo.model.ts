import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Hashtag } from './hashtag.model';

@ObjectType()
export class Photo {
  @Field(() => Int)
  id: number;
  @Field(() => User)
  user?: User;
  @Field(() => Int)
  userId: number;
  @Field(() => String)
  file: string;
  @Field(() => String, { nullable: true })
  caption?: string;
  @Field(() => [Hashtag], { nullable: true, defaultValue: [] })
  hashtags?: Hashtag[];
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isMine?: boolean;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => Int, { nullable: true })
  likes?: number;
  @Field(() => Int, { nullable: true })
  comments?: number;
}
