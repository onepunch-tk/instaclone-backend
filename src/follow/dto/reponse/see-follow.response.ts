import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';
import { Follow } from 'src/common/models/follow.model';

@ObjectType()
export class SeeFollowResponse extends createResponseType(Follow) {}
