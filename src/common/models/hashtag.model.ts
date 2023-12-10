import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Photo } from './photo.model';

@ObjectType()
export class Hashtag {
  @Field(() => Int)
  id: string;
  @Field(() => String)
  hashtag: string;
  @Field(() => [Photo], { nullable: true, defaultValue: [] })
  photos?: Photo[];
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
