import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseType } from '../../../common/graphql-reponse.type';
import { User } from '../../../models/user.model';

@ObjectType()
export class CreateUserResponse extends ResponseType {
  @Field(() => User, { nullable: true })
  user?: User;
}
