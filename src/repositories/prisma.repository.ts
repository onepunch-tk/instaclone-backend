import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaRepository
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // 로깅 설정 추가
    });
  }
  async onModuleInit() {
    await this.connectToDatabase();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async connectToDatabase(retryCount = 0) {
    try {
      await this.$connect();
      console.log('Database connected successfully.');
    } catch (error) {
      console.error('Database connection failed: ', error);
      if (retryCount >= 5) {
        console.error('Max retry attempts reached. Exiting...');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10초 대기
      await this.connectToDatabase(retryCount + 1);
    }
  }
}
