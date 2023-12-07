import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { processRequest } from 'graphql-upload';
import { FastifyRequest } from 'fastify';

interface MultipartFastifyReq extends FastifyRequest {
  isMultipart: boolean;
}

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
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

  await app.listen(process.env.PORT);
}
bootstrap();
