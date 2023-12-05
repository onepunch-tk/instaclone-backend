import { ObjectType } from '@nestjs/graphql';
import { ResponseType } from '../../../common/graphql-reponse.type';

@ObjectType()
export class EditProfileResponse extends ResponseType {}
