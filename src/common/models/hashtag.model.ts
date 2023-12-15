import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Photo } from './photo.model';

@ObjectType()
export class Hashtag {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  hashtag: string;
  @Field(() => [Photo], { nullable: true, defaultValue: [] })
  photos?: Photo[];
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => Int)
  totalPhotos?: number;
}
