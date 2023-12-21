import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/dto/responses/response.helpers';
import { Success } from '../../../common/dto/responses/success.response';

@ObjectType()
export class CreateCommentResponse extends createResponse(Success) {}
