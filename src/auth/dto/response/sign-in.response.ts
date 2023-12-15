import { Field, ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';

@ObjectType()
class Token {
  @Field(() => String, { nullable: true })
  token?: string;
}

@ObjectType()
export class SignInResponse extends createResponse(Token) {}
