import { Field, ObjectType } from '@nestjs/graphql';

// ResponseType 클래스 정의
@ObjectType()
export class ResponseType {
  @Field(() => Boolean, { defaultValue: true })
  success?: boolean;

  @Field({ nullable: true })
  error?: string;
}
