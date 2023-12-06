import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql/error';

@Catch(GraphQLError)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlCtx = GqlArgumentsHost.create(host).getContext();
    const { test } = gqlCtx.response;
    switch (test) {
      case 'kk':
        console.log('kk');
        break;
    }
    return exception;
  }
}
