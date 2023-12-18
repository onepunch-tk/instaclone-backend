import { ObjectType } from '@nestjs/graphql';
import { Photo } from '../../../common/models/photo.model';
import { createResponse } from '../../../common/dto/response';

@ObjectType()
export class PhotoResponse extends createResponse(Photo) {}
