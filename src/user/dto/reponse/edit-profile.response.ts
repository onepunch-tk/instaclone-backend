import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../models/user.model';
import { createResponseType } from '../../../common/types/graphql-reponse.type';

@ObjectType()
export class EditProfileResponse extends createResponseType(User) {}
