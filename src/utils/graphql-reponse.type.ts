import { Field, ObjectType } from '@nestjs/graphql';

// ResponseType 클래스 정의
@ObjectType()
export class ResponseType {
  @Field(() => Boolean)
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}
