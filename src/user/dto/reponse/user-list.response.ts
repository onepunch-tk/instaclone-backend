import { ObjectType } from '@nestjs/graphql';
import { createArrayResponse } from '../../../common/graphql/response';
import { User } from '../../../common/models/user.model';

@ObjectType()
export class UserListResponse extends createArrayResponse(User) {}
