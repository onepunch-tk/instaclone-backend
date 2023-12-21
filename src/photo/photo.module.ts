import { Module } from '@nestjs/common';
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';
import { PrismaRepository } from '../repositories/prisma.repository';
import { HashtagLoader } from '../common/loaders/hashtag.loader';

@Module({
  providers: [PhotoResolver, PhotoService, PrismaRepository, HashtagLoader],
})
export class PhotoModule {}
