import { Field, ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';

@ObjectType()
class Success {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}
@ObjectType()
export class FollowResponse extends createResponse(Success) {}
