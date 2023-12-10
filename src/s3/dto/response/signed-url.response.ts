import { Field, ObjectType } from '@nestjs/graphql';
import { createResponseType } from '../../../common/types/graphql-reponse.type';

@ObjectType()
class Url {
  @Field(() => String)
  signedUrl: string;
}
@ObjectType()
export class SignedUrlResponse extends createResponseType(Url) {}
