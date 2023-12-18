import { ObjectType } from '@nestjs/graphql';
import { createArrayResponse } from '../../../common/dto/response';
import { Comment } from '../../../common/models/comment.model';

@ObjectType()
export class GetCommentsResponse extends createArrayResponse(Comment) {}
