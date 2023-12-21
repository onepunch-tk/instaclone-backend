import { ObjectType } from '@nestjs/graphql';
import { Comment } from '../../../common/models/comment.model';
import { createArrayResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class GetCommentsResponse extends createArrayResponse(Comment) {}
