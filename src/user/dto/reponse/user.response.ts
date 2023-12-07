import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';
import { User } from '../../../common/models/user.model';

@ObjectType()
export class UserResponse extends createResponseType(User) {}
