import { ObjectType } from '@nestjs/graphql';
import { Photo } from '../../../common/models/photo.model';
import { createResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class PhotoResponse extends createResponse(Photo) {}
