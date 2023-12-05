import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaRepository } from '../repositories/prisma.repository';

@Module({
  providers: [UserResolver, UserService, PrismaRepository],
})
export class UserModule {}
