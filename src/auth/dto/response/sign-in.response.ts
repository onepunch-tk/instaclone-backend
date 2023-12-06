import { Field, ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';

@ObjectType()
class Token {
  @Field(() => String, { nullable: true })
  token?: string;
}

@ObjectType()
export class SignInResponse extends createResponseType(Token) {}
