import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Photo } from './photo.model';

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;
  @Field(() => Photo)
  photo: Photo;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}
