import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLFormattedError } from 'graphql';
import { ApolloError } from 'apollo-server-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      formatError: (error: GraphQLFormattedError) => {
        const graphQLError = new ApolloError(error.message);
        return {
          // ...graphQLError,
          message: error.message, // 원래 오류 메시지
          success: false, // 성공 여부
          // 필요한 경우 추가 정보 포함
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
  }
}
