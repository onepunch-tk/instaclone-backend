import { ObjectType } from '@nestjs/graphql';
import { createResponse, Success } from '../../../common/dto/response';

@ObjectType()
export class CreateCommentResponse extends createResponse(Success) {}
