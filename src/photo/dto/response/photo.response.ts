import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';
import { Photo } from '../../../common/models/photo.model';

@ObjectType()
export class PhotoResponse extends createResponse(Photo) {}
