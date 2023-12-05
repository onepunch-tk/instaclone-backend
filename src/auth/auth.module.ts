import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaRepository } from '../repositories/prisma.repository';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
  ],
  providers: [AuthService, PrismaRepository, AuthResolver],
})
export class AuthModule {}
