import { ObjectType } from '@nestjs/graphql';
import { createArrayResponse } from '../../../common/graphql/response';
import { Photo } from '../../../common/models/photo.model';

@ObjectType()
export class PhotoListResponse extends createArrayResponse(Photo) {}
