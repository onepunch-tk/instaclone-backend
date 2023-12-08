import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Follow extends PickType(User, [
  'id',
  'followedBy',
  'following',
] as const) {
  @Field(() => Int, { nullable: true })
  followedByCount?: number;

  @Field(() => Int, { nullable: true })
  followingCount?: number;
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isMe?: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isFollowing?: boolean;
}
