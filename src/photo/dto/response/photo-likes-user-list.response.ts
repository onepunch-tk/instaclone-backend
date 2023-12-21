import { ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { createArrayResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class PhotoLikesUserListResponse extends createArrayResponse(
  PickType(User, ['id', 'username', 'avatar'] as const),
) {}
