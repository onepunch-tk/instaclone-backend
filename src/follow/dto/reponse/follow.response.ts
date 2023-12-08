import { Field, ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';

@ObjectType()
class Success {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}
@ObjectType()
export class FollowResponse extends createResponseType(Success) {}
