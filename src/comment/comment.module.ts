import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaRepository } from '../repositories/prisma.repository';

@Module({
  providers: [CommentService, CommentResolver, PrismaRepository],
})
export class CommentModule {}
