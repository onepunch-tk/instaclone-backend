import { ObjectType } from '@nestjs/graphql';
import { SignedUrl } from 'src/common/models/signed-url.model';
import { createResponse } from '../../../common/dto/responses/response.helpers';

@ObjectType()
export class SignedUrlResponse extends createResponse(SignedUrl) {}
