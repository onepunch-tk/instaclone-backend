import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Photo } from './photo.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [User], { nullable: true })
  followedBy?: User[];

  @Field(() => [User], { nullable: true })
  following?: User[];

  @Field(() => [Photo], { nullable: true, defaultValue: [] })
  photos?: Photo[];

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isMe?: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isFollowing?: boolean;
}
