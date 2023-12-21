import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/dto/responses/response.helpers';
import { Follow } from '../../../common/models/follow.model';

@ObjectType()
export class GetFollowResponse extends createResponse(Follow) {}
