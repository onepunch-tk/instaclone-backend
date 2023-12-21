import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { createArrayResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class UserListResponse extends createArrayResponse(User) {}
