import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Error } from './error.response';

// ResponseType을 생성하는 고차 함수
export function createResponse<T>(TItem: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class GenericResponseType {
    @Field(() => Error, { nullable: true })
    errors?: Error;

    @Field(() => TItem, { nullable: true })
    data?: T;
  }

  return GenericResponseType;
}

export function createArrayResponse<T>(TItem: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class GenericResponseType {
    @Field(() => Error, { nullable: true })
    errors?: Error;

    @Field(() => [TItem], { nullable: true })
    data?: T[];
  }

  return GenericResponseType;
}
