import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { PrismaRepository } from '../repositories/prisma.repository';

@Module({
  providers: [LikeResolver, LikeService, PrismaRepository],
})
export class LikeModule {}
