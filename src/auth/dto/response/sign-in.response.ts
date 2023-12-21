import { Field, ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
class Token {
  @Field(() => String, { nullable: true })
  token?: string;
}

@ObjectType()
export class SignInResponse extends createResponse(Token) {}
