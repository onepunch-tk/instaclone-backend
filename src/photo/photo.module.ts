import { Module } from '@nestjs/common';
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';
import { PrismaRepository } from '../repositories/prisma.repository';

@Module({
  providers: [PhotoResolver, PhotoService, PrismaRepository],
})
export class PhotoModule {}
