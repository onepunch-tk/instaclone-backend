import { ObjectType } from '@nestjs/graphql';
import { Photo } from '../../../common/models/photo.model';
import { createArrayResponse } from '../../../common/dto/response';

@ObjectType()
export class PhotoListResponse extends createArrayResponse(Photo) {}
