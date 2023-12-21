import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../common/models/user.model';
import { createResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class EditProfileResponse extends createResponse(User) {}
