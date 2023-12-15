import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';
import { Hashtag } from '../../../common/models/hashtag.model';

@ObjectType()
export class HashtagResponse extends createResponseType(Hashtag) {}
