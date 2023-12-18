import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { createResponse } from 'src/common/dto/response';

@ObjectType()
export class UserResponse extends createResponse(User) {}
