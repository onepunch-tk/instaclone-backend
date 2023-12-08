import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { processRequest } from 'graphql-upload';
import { FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import { resolve } from 'path';

interface MultipartFastifyReq extends FastifyRequest {
  isMultipart: boolean;
}

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ logger: true });
  const fastify = fastifyAdapter.getInstance();
  fastify.addContentTypeParser(
    'multipart',
    (request: MultipartFastifyReq, payload, done) => {
      request.isMultipart = true;

      done(
        request.validationError ? request.validationError : null,
        request.body,
      );
    },
  );
  fastify.addHook(
    'preValidation',
    async function (request: MultipartFastifyReq, reply) {
      if (!request.isMultipart) {
        return;
      }

      request.body = await processRequest(request.raw, reply.raw);
    },
  );
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  await app.register(fastifyStatic, {
    root: resolve(process.cwd(), 'uploads'), // 'public' 폴더 경로 설정
    prefix: '/static/', // URL 접두사 (예: http://localhost:3000/public/images/example.jpg)
  });
  await app.listen(process.env.PORT);
}
bootstrap();
