import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';
import { SignedUrl } from 'src/common/models/signed-url.model';

@ObjectType()
export class SignedUrlResponse extends createResponseType(SignedUrl) {}
