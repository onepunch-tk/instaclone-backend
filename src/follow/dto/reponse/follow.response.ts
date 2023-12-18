import { ObjectType } from '@nestjs/graphql';
import { createResponse, Success } from '../../../common/dto/response';

@ObjectType()
export class FollowResponse extends createResponse(Success) {}
