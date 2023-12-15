import { ObjectType } from '@nestjs/graphql';
import { createResponse } from '../../../common/graphql/response';
import { SignedUrl } from 'src/common/models/signed-url.model';

@ObjectType()
export class SignedUrlResponse extends createResponse(SignedUrl) {}
