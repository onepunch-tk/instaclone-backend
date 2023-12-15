import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaRepository } from '../repositories/prisma.repository';
import { HashtagResponse } from './dto/response/hashtag.response';
import { SeeHashtagInput } from './dto/input/see-hashtag.input';
import { PhotoPaginationInput } from './dto/input/photo-pagenation.input';

@Injectable()
export class HashtagService {
  constructor(private readonly prisma: PrismaRepository) {}
  async seeHashtag({ hashtag }: SeeHashtagInput): Promise<HashtagResponse> {
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

  async getPhotos(id: number, { afterId, pageSize }: PhotoPaginationInput) {
    return this.prisma.photo.findMany({
      where: {
        hashtags: { some: { id } },
      },
      take: pageSize,
      skip: afterId ? 1 : 0,
      ...(afterId && { cursor: { id: afterId } }),
    });
  }
}
