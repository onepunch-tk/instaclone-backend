import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SignedUrlInput {
  @Field(() => String)
  fileName: string;
  @Field(() => String)
  contentType: string;
  @Field(() => Int)
  fileSize: number;
}
