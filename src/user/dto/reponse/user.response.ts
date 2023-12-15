import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';
import { User } from '../../../common/models/user.model';

@ObjectType()
export class UserResponse extends createResponse(User) {}
