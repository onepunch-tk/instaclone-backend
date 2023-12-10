import { ObjectType } from '@nestjs/graphql';
import { createArrayResponseType } from '../../../common/types/graphql-reponse.type';
import { User } from '../../../common/models/user.model';

@ObjectType()
export class UserListResponse extends createArrayResponseType(User) {}
