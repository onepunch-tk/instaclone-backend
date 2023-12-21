import { ObjectType } from '@nestjs/graphql';
import { Hashtag } from '../../../common/models/hashtag.model';
import { createResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class HashtagResponse extends createResponse(Hashtag) {}
