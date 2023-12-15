import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { createResponse } from '../../../common/graphql/response';

@ObjectType()
export class EditProfileResponse extends createResponse(User) {}
