import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagResolver } from './hashtag.resolver';
import { PrismaRepository } from '../repositories/prisma.repository';

@Module({
  providers: [HashtagService, HashtagResolver, PrismaRepository],
})
export class HashtagModule {}
