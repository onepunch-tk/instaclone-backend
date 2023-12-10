import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';
import { Photo } from '../../../common/models/photo.model';

@ObjectType()
export class PhotoResponse extends createResponseType(Photo) {}
