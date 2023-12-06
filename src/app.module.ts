import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLFormattedError } from 'graphql';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';

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
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
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
