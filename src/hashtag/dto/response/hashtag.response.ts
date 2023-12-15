import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';
import { Hashtag } from '../../../common/models/hashtag.model';

@ObjectType()
export class HashtagResponse extends createResponse(Hashtag) {}
