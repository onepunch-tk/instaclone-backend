import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
class Error {
  @Field(() => String)
  message: string;
}
// ResponseType을 생성하는 고차 함수
export function createResponseType<T>(TItem: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class ResponseType {
    @Field(() => Error, { nullable: true })
    errors?: Error;

    @Field(() => TItem, { nullable: true })
    data?: T;
  }

  return ResponseType;
}

export function createArrayResponseType<T>(TItem: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class ResponseType {
    @Field(() => Error, { nullable: true })
    errors?: Error;

    @Field(() => [TItem], { nullable: true })
    data?: T[];
  }

  return ResponseType;
}
