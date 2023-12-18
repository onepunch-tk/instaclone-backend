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
import { FollowModule } from './follow/follow.module';
import { S3Module } from './s3/s3.module';
import { PhotoModule } from './photo/photo.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().port(),
        SECRET_KEY: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      context: ({ req, reply }) => ({ req, reply }),
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
    FollowModule,
    S3Module,
    PhotoModule,
    HashtagModule,
    LikeModule,
    CommentModule,
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
export class AppModule {}
