import { ObjectType } from '@nestjs/graphql';
import { createResponse, Success } from '../../../common/dto/response';

@ObjectType()
export class LikeOnPhotoResponse extends createResponse(Success) {}
