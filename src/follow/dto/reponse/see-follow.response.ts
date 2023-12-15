import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';
import { Follow } from 'src/common/models/follow.model';

@ObjectType()
export class SeeFollowResponse extends createResponse(Follow) {}
