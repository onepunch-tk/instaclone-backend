import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaRepository } from '../repositories/prisma.repository';
import { PhotoLoader } from '../common/loaders/photo.loader';
import { PhotoService } from '../photo/photo.service';

@Module({
  providers: [
    UserResolver,
    UserService,
    PrismaRepository,
    PhotoLoader,
    PhotoService,
  ],
})
export class UserModule {}
