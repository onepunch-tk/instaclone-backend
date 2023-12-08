import { Module } from '@nestjs/common';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { PrismaRepository } from '../repositories/prisma.repository';

@Module({
  providers: [FollowResolver, FollowService, PrismaRepository],
})
export class FollowModule {}
