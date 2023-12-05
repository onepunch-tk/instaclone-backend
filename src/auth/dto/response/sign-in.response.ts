import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseType } from '../../../common/graphql-reponse.type';

@ObjectType()
export class SignInResponse extends ResponseType {
  @Field(() => String, { nullable: true })
  token?: string;
}
