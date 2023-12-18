import { ObjectType, PickType } from '@nestjs/graphql';
import { createArrayResponse } from '../../../common/dto/response';
import { User } from '../../../common/models/user.model';

@ObjectType()
export class PhotoLikesUserListResponse extends createArrayResponse(
  PickType(User, ['id', 'username', 'avatar'] as const),
) {}
