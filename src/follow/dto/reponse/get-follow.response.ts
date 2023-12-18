import { ObjectType } from '@nestjs/graphql';
import { Follow } from 'src/common/models/follow.model';
import { createResponse } from '../../../common/dto/response';

@ObjectType()
export class GetFollowResponse extends createResponse(Follow) {}
