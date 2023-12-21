import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { HashtagResponse } from './dto/response/hashtag.response';
import { GetHashtagInput } from './dto/input/get-hashtag.input';
import { PaginationInput } from '../common/dto/input/pagination.input';

@Injectable()
export class HashtagService {
  constructor(private readonly prisma: PrismaRepository) {}
  async getHashtag({ hashtag }: GetHashtagInput): Promise<HashtagResponse> {
    try {
      const findHashtag = await this.prisma.hashtag.findUnique({
        where: { hashtag },
      });
      if (!findHashtag) {
        throw new ForbiddenException('not found hashtag.');
      }
      return {
        data: { ...findHashtag },
      };
    } catch (e) {
      return {
        errors: {
          message: e.message,
        },
      };
    }
  }

  async getTotalPhotoCount(id: number) {
    return this.prisma.photo.count({
      where: {
        hashtags: {
          some: {
            id,
          },
        },
      },
    });
  }

  async getPhotos(id: number, { afterId, pageSize }: PaginationInput) {
    return this.prisma.photo.findMany({
      where: {
        hashtags: { some: { id } },
      },
      take: pageSize,
      skip: afterId ? 1 : 0,
      ...(afterId && { cursor: { id: afterId } }),
    });
  }

  async getHashtagsByPhotoIds(photoIds: number[]) {}
}
